//context api allows us to store global state without having to use any additional third party/libraries 

import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import { loadStripe, Stripe } from "@stripe/stripe-js";


//we wanna initialize stripe when the app loads
//coz we wanna this to happen once when the app loads
//to connect to Stripe from our frontend, we need to get our publishable key
//so we'll store this in environment variables
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || ""

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR"
}

//whenever our components call the show toast function, 
//they'll have to pass in an object that contains the message and the type 
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
}


//whenever the app load for the first time, the context is gonna be undefined
const AppContext = React.createContext<AppContext | undefined>(undefined);

//LOAD STRIPE
const stripePromise = loadStripe(STRIPE_PUB_KEY);

//after creating the context, we need to create the provider
// a provider is the thing that wraps our components and gives our components access to the things in the context
//give the children an in-line type
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  //declare a state object which holds the state of the toast: in other words, if it's gonna display or not.
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  //this gonna call our validate token endpoint using our api client, and this is gonna return if there's an error or not
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });
  //we need to invalidate the useQuery("validateToken") whenever we sign out
  //so that it knows to make the request to check the token to update is lsLoggedIn variable
  //this process is gonna be done in the SignOutButton file

  return (
    <AppContext.Provider
      value={{ 
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError, //if there's no error when we try to validate the token it means the token is good
                            //and isLoggedIn is gonna be true  and then we pass that to all our components

        //we wanna expose stripePromise from our AppContext so our components can use it
        stripePromise,


                            
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => {
    const context = useContext(AppContext)
    return context as AppContext
}





