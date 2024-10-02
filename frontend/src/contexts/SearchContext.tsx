//This is the context where we store the user search criteria that they filled 
//into the form after they hit submit
//the reason we're doing this is because we need to get those values in quite 
//a lot of places in our app, so putting it in a context makes it easier to do that

import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
    ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);


//define a type for the provider
type SearchContextProviderProps = {
    children: React.ReactNode;
}
export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    // const [destination, setDestination] = useState<string>("");
    // const [checkIn, setCheckIn] = useState<Date>(new Date());
    // const [checkOut, setCheckOut] = useState<Date>(new Date());
    // const [adultCount, setAdultCount] = useState<number>(1);
    // const [childCount, setChildCount] = useState<number>(0);
    // const [hotelId, setHotelId] = useState<string>("");


    //replacing the string by arrow function 
    //the lets us define the initial state as using a function instead of a hard coded value
    //THIS IS gonna check the session storage for a destination field
    //and if it exists, it's gonna populate the state object for us
    //ALSO there is a chance that it's gonna be undefined or null 
    //so if it's null we just wanna add an empty string as a default value
    const [destination, setDestination] = useState<string>(
      () => sessionStorage.getItem("destination") || ""
    );
    const [checkIn, setCheckIn] = useState<Date>(
      () =>
        new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
    );
    const [checkOut, setCheckOut] = useState<Date>(
      () =>
        new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
    );
    const [adultCount, setAdultCount] = useState<number>(() =>
      parseInt(sessionStorage.getItem("adultCount") || "1")
    );
    const [childCount, setChildCount] = useState<number>(() =>
      parseInt(sessionStorage.getItem("childCount") || "0")
    );
    const [hotelId, setHotelId] = useState<string>(
      () => sessionStorage.getItem("hotelID") || ""
    );
    //Now that we initialize our state values from session storage what
    //we need to do is save to session storage whenever we update the state variables
    //and the best way to do this is in saveSearchValues function coz this what all
    //our component use and this is where we're setting the state currently
    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        //adding a question mark coz it's an optional parameter
        hotelId?: string
    ) => {
      setDestination(destination);
      setCheckIn(checkIn);
      setCheckOut(checkOut);
      setAdultCount(adultCount);
      setChildCount(childCount);
      if (hotelId) {
        setHotelId(hotelId);
      }
      //we need to do is save to session storage whenever we update the state variables
      //and the best way to do this is in saveSearchValues function coz this what all
      //our component use and this is where we're setting the state currently
      sessionStorage.setItem("destination", destination);
      sessionStorage.setItem("checkIn", checkIn.toISOString());
      sessionStorage.setItem("checkOut", checkOut.toISOString());
      sessionStorage.setItem("adultCount", adultCount.toString());
      sessionStorage.setItem("childCount", childCount.toString());
      if (hotelId) {
        sessionStorage.setItem("hotelId", hotelId);
      }
    };

    return (
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    )
}

//creating a hook that lets our components get easy access to these properties 
export const useSearchContext = () => {
    const context = useContext(SearchContext)
    return context as SearchContext;
}



//save our search values into session storage
//to prevent these search values from being lost if the page gets refreshed 
//SO by storing these in session storage, it means we can persist these data
//as long as the user has the tap open

//it's a nice compromise to use the session storage coz using localStorage
//which would persist it across all taps and all windows, 
//just makes it a bit harder to manage the data as there could be STEAL data
//on the user's browser and if different users are logging in and out of
//the same computer then, it'll be a bit of a pain to manage that 

