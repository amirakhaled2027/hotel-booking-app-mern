import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";


type Props = {
    currentUser: UserType;
    //STRIPE
    paymentIntent: PaymentIntentResponse; 
};

//defining a type for our form
//and this basically have to describe the inputs on the form
//export it to be able to use it in api-client in (TIE ALL STRIPE PAYMENT INTO THE ROOM BOOKING API)
export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    //updating the form type to hold the rest of the stuff that we need to create
    //for a room booking
    //TO SAVE the booking to the database, we need to know the types of the previous data besides the following data
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    //the reason we need to pass the payment intent id id because our booking
    //endpoint is gonna check the status of the payment just to make sure that
    //it's a valid payment for this hotel and for the user who's trying to 
    //book the room
    paymentIntentId: string;
    totalCost: number;

    //do the same in the defaultValues
}


function BookingForm({ currentUser, paymentIntent }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const search = useSearchContext();
  const {hotelId} = useParams();

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
    //we're gonna get the toast message from the AppContext
    onSuccess: () => {
      showToast({message: "Booking successful", type: "SUCCESS"});
    },
    onError: () => {
      showToast({message: "Error saving booking!", type: "ERROR"});
    },
  }); 


    const { handleSubmit, register } = useForm<BookingFormData>({
        //whenever this component renders if we have a currentUser, it's gonna 
        //pre-populate th form based on the stat from the currentUser object
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            //for adding the rest of the stuff
            //so for the checkIn/Out dates and the adult/childCount is gonna come from the SearchContext
            adultCount: search.adultCount,
            childCount: search.childCount,
            //anytime you're sending across on an API the best thing to do is to 
            //convert it to an ISO string as this is a format is widely known by 
            //lots of frameworks and packages and it's just a bit of a convention 
            //that developers use to keep things consistent
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId,
            
        }
    });

    //FOR SUBMITTING
    const onSubmit = async (formData: BookingFormData) => {
      
      //STEP 2
      //this will never happen as the onSubmit will only gets called when the 
      //form get submitted but typescript thinks this function isn't gonna work
      //if stripe hasn't been loaded before it gets called 
      //so it's a typescript thing being a little bit too safe so we will provide
      //it anyway just to keep typescript/the code happy
      if(!stripe || !elements) { 
        return;
      }

      //STEP 1
      //this stripe variable will come from the useStripe hook,
      //which is provided by the stripe SDK
      //This is different from the stripe stuff we added to our own AppContext.tsx
      //which actually added the stripe 
      //SO they both stripe stuff, but they do different things
      //sending the card details that the user entered to stripe in the confirmCardPayment
      const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          //use have to get the elements from the useElement hook
          card: elements.getElement(CardElement) as StripeCardElement,
        }
      });

      if (result.paymentIntent?.status === "succeeded") {
        //we're just adding the paymentIntentId to the rest of the field that 
        //we're getting from the formData
        //THE REASON: to make sure that we have the most up-to-date the
        //paymentIntentId as it comes from the call that happens previously
        //so then we know that this is always gonna be the most up-to-date-id
        //just in case stripe decided to change it or whatever reason
        bookRoom({...formData, paymentIntentId: result.paymentIntent.id});
      }
    };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="email"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      {/* STRIPE PAYMENT SECTION */}
      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ${paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>

        {/* CARD DETAILS */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Payment Details</h3>
          <CardElement
            id="payment-element"
            className="border rounded-md p-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
        disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}

export default BookingForm



//we're gonna fetch the hotel based on the ID that we received on the URL 
//so that we can get the full location then we're gonna populate the rest 
//of the stuff based on the search query that the user entered into the
//search bar which we can get from the search context