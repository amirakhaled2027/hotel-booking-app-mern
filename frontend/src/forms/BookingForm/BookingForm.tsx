import { useForm } from "react-hook-form";
import {PaymentIntentResponse, UserType} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useState } from "react";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

//export it to be able to use it in api-client in (TIE ALL STRIPE PAYMENT INTO THE ROOM BOOKING API)
export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

function BookingForm({ currentUser, paymentIntent }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToast } = useAppContext();
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false); 

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking successful", type: "SUCCESS" });
        setIsBookingConfirmed(true); 
      },
      onError: () => {
        showToast({ message: "Error saving booking!", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  //FOR SUBMITTING
  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {

      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-sm border border-zinc-300 p-5"
    >
      <span className="text-3xl font-bold text-emerald-500">
        Confirm Your Details
      </span>
      <div className="grid sm:grid-cols-2 gap-2">
        <label className="text-black text-sm font-semibold flex-1 mb-2">
          First Name
          <input
            className="w-full mt-1 px-3 text-zinc-500 border-emerald-500 py-2 rounded-sm border-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>

        <label className="text-black text-sm font-semibold flex-1 mb-2">
          Last Name
          <input
            className="w-full mt-1 px-3 text-zinc-500 border-emerald-500 py-2 rounded-sm border-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>

        <label className="text-black text-sm font-semibold flex-1">
          Email
          <input
            className="w-full mt-1 px-3 text-zinc-500 border-emerald-500 py-2 rounded-sm border-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            type="email"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      {/* STRIPE PAYMENT SECTION */}
      <div className="space-y-2">
        <h2 className="font-semibold text-xl mt-3">Your Price Summary</h2>

        <div className="bg-amber-200 border-2 border-amber-500 rounded-sm p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ${paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>

        {/* CARD DETAILS */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold mt-6">
            Payment Details{" "}
            <span className="text-xs font-light text-zinc-600">
              (4242 4242 4242 4242)
            </span>
          </h3>
          <CardElement
            id="payment-element"
            className="rounded-[5px] p-2 text-sm border-2 border-amber-500 text-amber-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isLoading || isBookingConfirmed} // Disable if loading OR booking confirmed
          type="submit"
          className="bg-amber-500 text-white text-md font-semibold rounded-sm py-3 px-5  hover:bg-amber-600 disabled:bg-gray-500"
        >
          {isLoading
            ? "Saving..."
            : isBookingConfirmed
            ? "Booking Confirmed"
            : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}

export default BookingForm;
