import { HotelType } from "../../../backend/src/shared/types";



//define our prop types
type Props = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    numberOfNights: number;
    hotel: HotelType;
}


//create the component and destructure these props
function BookingDetailsSummary({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) {

  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
        <h2 className="text-xl font-bold">Your Booking Details</h2>

        {/* for the location */}
        <div className="border-b py-2">
            Location:
            <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
        </div>

        {/* for the checkIn & checkOut */}
        <div className="flex justify-between"> 
            <div>
                Check-in
                <div className="font-bold">{checkIn.toDateString()}</div>
            </div>
            <div>
                Check-out
                <div className="font-bold">{checkOut.toDateString()}</div>
            </div>
        </div>

        {/* for length of stay */}
        <div className="border-t border-b py-2">
            Total Length of Stay
            <div className="font-bold">{numberOfNights} nights</div>
        </div>

        {/* fot the guests */}
        <div>
            Guest {" "}<div className="font-bold">{adultCount} adults & {childCount} children</div>
        </div>
    </div>
  );
}

export default BookingDetailsSummary