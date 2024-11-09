import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

function BookingDetailsSummary({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) {
  return (
    <div className="grid gap-4 border border-zinc-300 rounded-sm p-5 h-fit ">
      <h2 className="text-2xl font-bold text-emerald-500 ">
        Your Booking Details
      </h2>

      {/* location */}
      <div className="border-b py-2 ">
        <span className="font-semibold mr-2 text-lg text-emerald-500">
          Location:
        </span>
        <div className="font-semibold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>

      {/* checkIn & checkOut */}
      <div className="lg:flex justify-between">
        <div>
          <span className="font-semibold mr-2 text-lg text-emerald-500">
            Check-in:
          </span>
          <div className="font-semibold">{checkIn.toDateString()}</div>
        </div>
        <div>
          <span className="font-semibold mr-2 text-lg text-emerald-500">
            Check-out:
          </span>
          <div className="font-semibold">{checkOut.toDateString()}</div>
        </div>
      </div>

      {/* length of stay */}
      <div className="border-t border-b py-2">
        <span className="font-semibold mr-2 text-lg text-emerald-500">
          Total Length of Stay:
        </span>
        <div className="font-semibold">{numberOfNights} nights</div>
      </div>

      {/* guests */}
      <div>
        <span className="font-semibold mr-2 text-lg text-emerald-500">
          Guests:
        </span>
        <div className="font-semibold">
          {adultCount} adults & {childCount} children
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsSummary;
