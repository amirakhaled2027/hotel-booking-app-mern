import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

function MyHotels() {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      // onError: () => {},
    }
  );

  //if there isn't any hotel data, then return "No Hotels Found"
  if (!hotelData) {
    return <span>No Hotel found</span>;
  }

  return (
    <section>
      {/* Container */}
      <div className="px-5 md:px-10 mt-20 md:mt-0 h-[70%] rounded-sm">
        {/* Component */}
        <div className="  mx-auto max-w-7xl">
          <div className="space-y-5 ">
            <span className="flex justify-between">
              <h1 className="text-3xl font-bold text-emerald-500">My Hotels</h1>
              <Link
                to="/add-hotel"
                className="flex bg-emerald-500 text-white text-xl font-semibold hover:bg-emerald-600 rounded-sm py-3 px-5 "
              >
                Add Hotel
              </Link>
            </span>

            {/* displaying the cards  */}
            <div className="grid grid-cols-1 gap-8 ">
              {hotelData.map((hotel) => (
                <div
                  className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 justify-between border-2 border-emerald-500 rounded-lg p-8 "
                  key={hotel._id}
                >
                  {/* Left Side */}
                  <div className=" flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold" key={hotel.name}>
                        {hotel.name}
                      </h2>
                      <div
                        key={hotel.description}
                        className="text-[17px] leading-8"
                      >
                        {hotel.description}
                      </div>
                    </div>
                    <span className="flex mt-auto">
                      <Link
                        to={`/edit-hotel/${hotel._id}`}
                        className="flex bg-amber-500 text-white text-xl font-semibold rounded-sm py-3 px-5 mt-10 hover:bg-amber-600"
                      >
                        View Details
                      </Link>
                    </span>
                  </div>

                  {/* Right Side */}
                  <div className=" grid grid-rows-5 gap-3 w-[90%] h-full p-5  rounded-sm bg-white  border-8 border-zinc-100">
                    <div
                      className="text-base font-medium border-2  border-emerald-500 bg-zinc-100 rounded-lg p-3 flex items-center"
                      key={`${hotel.city}-${hotel.country}`}
                    >
                      <BsMap className="mr-1 text-lg font-medium text-amber-500" />
                      <span className="text-base font-medium text-emerald-500 pr-1">
                        Location:
                      </span>
                      {hotel.city}, {hotel.country}
                    </div>
                    <div
                      className="font-medium  border-2  border-emerald-500 bg-zinc-100 rounded-lg p-3 flex items-center"
                      key={hotel.type}
                    >
                      <BsBuilding className="mr-1 text-lg font-medium text-amber-500" />
                      <span className="text-base font-medium text-emerald-500 pr-1">
                        Type:
                      </span>
                      {hotel.type}
                    </div>
                    <div
                      className=" font-medium  border-2  border-emerald-500 bg-zinc-100 rounded-lg p-3 flex items-center"
                      key={hotel.pricePerNight}
                    >
                      <BiMoney className="mr-1 text-lg font-medium text-amber-500" />
                      <span className="text-base font-medium text-emerald-500 pr-1">
                        Price:
                      </span>
                      ${hotel.pricePerNight} per night
                    </div>
                    <div
                      className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-3 flex items-center"
                      key={`${hotel.adultCount}-${hotel.childCount}`}
                    >
                      <BiHotel className="mr-1 text-lg font-medium text-amber-500" />
                      <span className="text-base font-medium text-emerald-500 pr-1">
                        Guests:
                      </span>
                      {hotel.adultCount} adults, {hotel.childCount} children
                    </div>
                    <div
                      className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-3 flex items-center"
                      key={hotel.starRating}
                    >
                      <BiStar className="mr-1 text-lg font-medium text-amber-500" />
                      <span className="text-base font-medium text-emerald-500 pr-1">
                        Rating:
                      </span>
                      {hotel.starRating} Star Rating
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyHotels;
