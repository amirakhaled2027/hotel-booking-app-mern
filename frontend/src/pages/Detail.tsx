import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import GuestInfoForm from "../forms/ManageHotelForm/GuestInfoForm/GuestInfoForm";
import StarIcon from "../assets/starIcon.svg";

function Detail() {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  //adding a little check
  if (!hotel) {
    return <></>;
  }

  return (
    <section>
      {/* Container */}
      <div className="px-5 md:px-10 mt-20 md:mt-0 h-[70%] rounded-sm ">
        {/* Component */}
        <div className="  mx-auto max-w-7xl ">
          <div className="space-y-6">
            {/* the star rating and the heading/hotel name */}
            <div>
              <div className="md:flex justify-between font-medium mb-3">
                <span className="flex pb-1 sm:pb-0">
                  <span className="text-emerald-500 mr-1  ">Rating:</span>
                  <span className="flex items-center gap-1">
                    <img src={StarIcon} alt="" className="w-4" />
                    {hotel.starRating}
                  </span>
                </span>
                <span className="flex">
                  <span className="text-emerald-500 mr-1">Location: </span>
                  {hotel.country} {hotel.country}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>

            {/* the image grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
              {hotel.imageUrls.map((image) => (
                <div className="h-[300px]">
                  <img
                    src={image}
                    alt={hotel.name}
                    className="rounded-md w-full h-full object-cover object-center rounded-sm"
                  />
                </div>
              ))}
            </div>

            {/* adding the facilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 py-5 ">
              {hotel.facilities.map((facility) => (
                <div className="cursor-pointer bg-emerald-500 text-base rounded-lg px-4 py-3 font-semibold text-center text-white">
                  {facility}
                </div>
              ))}
            </div>

            {/* hotel description & number of guests */}
            <div className="grid grid-cols-1 md:grid-cols-[60%_40%] xl:grid-cols-[9fr_4fr] gap-8 justify-between">
              <div className="text-[17px] leading-8">{hotel.description}</div>
              <div>
                <GuestInfoForm
                  pricePerNight={hotel.pricePerNight}
                  hotelId={hotel._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
