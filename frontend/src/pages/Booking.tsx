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
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  // STRIPE PAYMENT
  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    // -------- //
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  const { data: hotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  console.log(currentUser?.email);

  // the hotel type comes from the useQuery hook and it might be undefined sometimes
  if (!hotel) {
    return <></>;
  }

  return (
    <section>
      {/* Container */}
      <div className="px-5 md:px-10 mt-48 sm:mt-36 md:mt-20 xl:mt-0 h-[70%] rounded-sm ">
        {/* Component */}
        <div className="  mx-auto max-w-7xl ">
          <div className="grid md:grid-cols-[1fr_2fr] gap-3">
            <BookingDetailsSummary
              checkIn={search.checkIn}
              checkOut={search.checkOut}
              adultCount={search.adultCount}
              childCount={search.childCount}
              numberOfNights={numberOfNights}
              hotel={hotel}
            />
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
        </div>
      </div>
    </section>
  );
}

export default Booking;
