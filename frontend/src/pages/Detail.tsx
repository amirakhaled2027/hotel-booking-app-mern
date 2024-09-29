import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from './../api-client';
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/ManageHotelForm/GuestInfoForm/GuestInfoForm";

function Detail() {
  //useParams() is a hook that comes from react-router-dom
  //it makes it a bit easier to get stuff out of the url
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    //what the following means: don't run this query if we haven't got a hotelId
    //the double !! means a truthy value, so if the hotel id is undefined, this
    //will result to false which means enabled is false, and if there's a value
    //for the hotelId, it's gonna result true which means enabled is true
    {
      enabled: !!hotelId,
    }
  );

  //adding a little check
  if (!hotel) {
    //just return an empty react fragment
    //while all the previous code is still loading/working in the background,
    //we wanna return an empty fragment, until the hotel is ready
    return <></>;
  }


  return (
    <div className="space-y-6">
      {/* the star rating and the heading/hotel name */}
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      {/* the image grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* adding the facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      {/* hotel description & number of guests */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div>{hotel.description}</div>
        <div>
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
}

export default Detail



