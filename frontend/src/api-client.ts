// this is where we're going to put all our fetch requests
// the reason we put it in a separate file is because it keeps the fetch requests themselves
// separate from the rest of the code, which makes it easier to read and understand

import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType, PaymentIntentResponse, UserType } from '../../backend/src/shared/types';
import { BookingFormData } from "./forms/BookingForm/BookingForm";

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




//ADDING THE FETCH REQUEST FOR THE /me ENDPOINT TO FETCH THE CURRENT USER
//added after the details page
export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

//FETCHING THE REGISTER ENDPOINT
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


//FETCHING THE SIGN IN ENDPOINT
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

//SHOWING THE HOTELS THAT ARE ADDED PREVIOUSLY 
//we also wanna specify the return type type of this data so the way we do this 
//is in our function after the async brackets we can add a colon
//and then we'll add our brackets, and then we will say Promise<HotelType[]>
//the HotelType is they type that we declared in the backend whenever we created 
//our hotel mongodb schema (hotel.ts)
// and the reason we do this is that the frontend and the backend are both working off the same type now
export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if(!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

//CALLING THE API THAT IS RESPONSIBLE FOR GIVING ACCESS TO THE USER TO edit his/her HOTEL DATA
//and we wanna specify a return type on this function so that the component is gonna know what type to receive back
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }
  return response.json();
};


//UPDATING THE HOTELS WE EDITED
export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};


//ADDING THE FETCH REQUEST TO CALL OUR SEARCH ENDPOINT

//defining a type for our search parameters; this will help us keep track of  
//all the different search parameters and filters 
export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  //updating the types after working on the filters on the backend
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  //adding them after working on the filters on the backend
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  //now we need to add the facilities, the types, and the stars
  //but since these can be arrays as we defined in the types and we can select more than one of them
  //we have to handle them more differently

  //what this is gonna do: if there are any facilites that were selected by the
  //user on the UI, then each of those facilities append them to our query params
  //under the facilities key
  searchParams.facilities?.forEach((facility) => 
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));




  //the ? after search to indicate the start of our query parameter
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};


//ADDING THE FETCH REQUEST FOR THE DETAILS PAGE
export const fetchHotelById = async(hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};


//STRIPE PAYMENT ENDPOINT
//adding some logic to the booking page that calls our create 
//payments intent endpoint whenever the page loads
export const createPaymentIntent = async(
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      }
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

//TIE ALL STRIPE PAYMENT INTO THE ROOM BOOKING API
export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
  //since we're not getting anything back in the request, we don't have to
  //return anything here
};


//ADDING THE FETCH REQUEST FOR MY BOOKING PAGE ENDPOINT
export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings!");
  };

  return response.json();
};

