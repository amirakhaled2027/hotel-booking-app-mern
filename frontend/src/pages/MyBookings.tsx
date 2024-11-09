import { useQuery } from "react-query";
import * as apiClient from "../api-client";

function MyBookings() {
  const { data: hotels } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  if (!hotels || hotels.length === 0) {
    return (
      <span className="flex justify-center mb-10 font-bold text-xl">
        No bookings found!
      </span>
    );
  }

  return (
    <section>
      {/* Container */}
      <div className="px-5 md:px-10 mt-20 md:mt-0 rounded-sm">
        {/* Component */}
        <div className="  mx-auto max-w-7xl ">
          <h1 className="text-3xl font-bold text-emerald-500 my-8">
            My Bookings
          </h1>
          {hotels.map((hotel) => (
            <div className="grid grid-cols-1 sm:grid-cols-[40%_60%] gap-16 border border-zinc-300 rounded-sm p-8 mb-2 ">
              {/* div for the image */}
              <div className="lg:w-full lg:h-[400px]">
                <img
                  src={hotel.imageUrls[0]}
                  className="w-full h-full object-cover object-center rounded-sm"
                />
              </div>

              {/* div for the content on the right */}
              <div className="flex flex-col gap-4 overflow-y-auto lg:w-[90%] lg:h-[400px]">
                <div className="text-3xl font-bold">{hotel.name}</div>

                {/* display the booking info */}
                {hotel.bookings.map((booking) => (
                  <div className="my-auto">
                    {/* LOCATION */}
                    <div className="border-b-2 border-emerald-500 w-[85%]   py-4">
                      <div className="font-semibold mr-2 text-lg text-emerald-500">
                        Location:
                      </div>
                      <div className="font-medium">
                        {hotel.city}, {hotel.country}
                      </div>
                    </div>

                    {/* start date */}
                    <div className="border-b-2 border-emerald-500 w-[85%]  py-4">
                      <div className="font-semibold mr-2 text-lg text-emerald-500">
                        Start Date:{" "}
                      </div>
                      <div className="font-medium">
                        {new Date(booking.checkIn).toDateString()}
                      </div>
                    </div>

                    {/* end date */}
                    <div className="border-b-2 border-emerald-500 w-[85%]  py-4">
                      <div className="font-semibold mr-2 text-lg text-emerald-500">
                        End Date:{" "}
                      </div>
                      <div className="font-medium">
                        {new Date(booking.checkOut).toDateString()}
                      </div>
                    </div>

                    {/* NUMBER OF GUESTS */}
                    <div className="border-b-2 border-transparent w-[85%]  py-4">
                      <div className="font-semibold mr-2 text-lg text-emerald-500">
                        Guests:{" "}
                      </div>
                      <div className="font-medium">
                        {booking.adultCount} adults, {booking.childCount}{" "}
                        children
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyBookings;
