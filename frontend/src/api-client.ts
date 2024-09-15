// this is where we're going to put all our fetch requests
// the reason we put it in a separate file is because it keeps the fetch requests themselves
// separate from the rest of the code, which makes it easier to read and understand

import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

//api base url is gonna come from the environment variables 
// so the reason we do this is because depending on if we are developing on our own machines 
// or if we deploy to render then the backend API_BASE_URL is going to be different so
// we will define an environment variable file for local host and then we will add the property to
// render.com later when we deploy our backend
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001
//coz we're using vite, we're gonna use it like that

//  || "" >>> this is added after we have the frontend and the backend bundled for production via dist folder
// we wont't have a VITE_API_BASE_URL; as they're gonna be on the sane URL from the moment we bundled them 
// this is gonna say to the fetch request that there's no API_BASE_URL, so just use the same server for all the requests 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// we're going to use react query to handle making this fetch request, storing any state and handling any errors that we get  

export const register = async (formData: RegisterFormData) => {
    const response = await fetch( `${API_BASE_URL}/api/users/register` , {
        method: "POST",
        //we now need to ensure that the cookie is getting set correctly on the browser
        //and then we will use this cookie to check if the user is logged in or not
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify(formData),
    });

    //we want to get the body of the response because we send back messages depending on the type of error we get from the backend
    const responseBody = await response.json();

    if(!response.ok) {
        throw new Error(responseBody.message)
    }
};


//SIGN IN
export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  const body = await response.json();

  if(!response.ok) {
    throw new Error(body.message);
  }
  return body;
}


//VALIDATE THE CURRENT USER INFO TO KEEP HIM SIGN IN
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

//SIGN OUT
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  });

  if(!response.ok) {
    throw new Error('Error during sign out');
  }
}

//ADDING HOTELS
export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: 'POST',
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  //if the response is good
  return response.json();
}