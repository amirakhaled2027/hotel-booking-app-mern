import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";


function Booking() {
    //STRIPE
    const { stripePromise } = useAppContext();
    //getting the search stuff out of the search context 
    const search = useSearchContext();
    //getting the hotelId
    const { hotelId } = useParams();

    //total length of stay is calculated based on the 
    //the reason we must put this in state is because the setNumberOfNights is 
    //gonna be dependant on the checkIn and checkOut dates that we get from
    //the search variable that comes from the useSearchContext hook
    //so we wanna make sure that whenever the useSearchContext renders, 
    //the numberOfNights gets updated as well 
    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    //based on that we wanna add the use effect hook
    useEffect(() => {
        if(search.checkIn && search.checkOut) {
            //we wanna run some logic to calculate the number of nights
           const nights =
           //the first section will give us the absolute value in thousands or whatever it's, 
           //then whenever we divide by THIS NUMBER, it's gonna convert it to days
             Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
             (1000 * 60 * 60 * 24);
            
            setNumberOfNights(Math.ceil(nights));
        }
        //the reason we wanna do this: coz we wanna make sure that anytime
        //the checkIn or checkOut changes in the global state the useEffect re-runs
        //and gets the new number of nights based on whatever the new values are
    }, [search.checkIn, search.checkOut]);

    // STRIPE PAYMENT
    const { data: paymentIntentData } = useQuery("createPaymentIntent", () =>
      apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()
      ),
      //only call this query if we have a hotelId and the number of nights 
      //is greater than zero
      //we wanna make sure, we only create a payment intent once we have a hotelId,
      //and we've calculated the number of nights that the user is trying to book
      {
        enabled: !!hotelId && numberOfNights > 0,
      }
    );

    //with passing the function, this will call our fetch request that we 
    //already created and that lives in our api-client
    const { data: hotel } = useQuery(
      "fetchHotelByID",
      () => apiClient.fetchHotelById(hotelId as string),
      //this means that this query is only gonna run if we have a hotelId
      {
        enabled: !!hotelId,
      }
    );

    const { data: currentUser } = useQuery(
      "fetchCurrentUser",
      apiClient.fetchCurrentUser
    );

    console.log(currentUser?.email);

    //coz the hotel type comes from the useQuery hook and it might be
    //undefined sometimes
    if (!hotel) {
        return <></>;
      }
 
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {/* the current user comes from get request that we made on the top when the page loads */}
      {/* <BookingForm currentUser={currentUser}/> */}
      {/* this means the booking form will only display if we have a current user 
          so if something went wrong, then it'll not display the booking form which 
          is okay which is likely means that there's quite a bad bug somewhere*/}
      {/* {currentUser && <BookingForm currentUser={currentUser}/>} */}

      {/* for STRIPE */}
      {/* add some stuff to our booking form so that we can connect it into the stripe UI elements */}
      {/* we're gonna adjust this conditional  */}
      {/* what the Elements does is it comes from the stripe frontend SDK and  
       it gives us access to some stripe UI elements that lets the user enter 
       in their card details, and Then also lets's us create a payment from the UI
       using the stripe SDK as well*/}
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentIntentData.clientSecret }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
}

export default Booking




