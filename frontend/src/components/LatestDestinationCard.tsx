import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import LocationIconGreen from "../assets/locationIconGreen.svg";
import StarIcon from "../assets/starIcon.svg";

type Props = {
  hotel: HotelType;
};

function LatestDestinationCard({ hotel }: Props) {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="w-full mx-auto rounded-sm overflow-hidden shadow-md hover:shadow-lg"
    >
      <div className="relative w-full h-[350px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-0 left-0 bg-zinc-400 bg-opacity-70 text-white px-4 py-1 m-2 rounded-lg text-xs font-medium">
          {hotel.type}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <img src={LocationIconGreen} alt="" className="w-4" />
            {hotel.country}, {hotel.city}
          </span>
          <span className="flex items-center gap-1">
            <img src={StarIcon} alt="" className="w-4" />
            {hotel.starRating}
          </span>
        </div>
        <h3 className="text-lg font-medium mb-2 truncate">{hotel.name}</h3>
        <p className="text-gray-600 text-sm mb-4">
          <div className=" flex flex-wrap justify-center items-center w-full mx-auto my-5">
            {hotel.facilities.slice(0, 2).map((facility) => (
              <span
                key={facility}
                className=" text-zinc-500 p-2 font-medium text-sm whitespace-nowrap border-r border-zinc-300 "
              >
                {facility}
              </span>
            ))}
            <span className="text-xs pt-3 pl-5 ">
              {hotel.facilities.length > 2 &&
                ` +${hotel.facilities.length - 2} more`}
            </span>
          </div>
        </p>
        <div className="flex  items-center justify-between border-t border-zinc-300 pt-3">
          <span className="font-bold text-base text-emerald-500">
            ${hotel.pricePerNight}
            <span className="text-black">/night</span>
          </span>
          <button className="bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-bold py-2 px-4 rounded">
            View More
          </button>
        </div>
      </div>
    </Link>
  );
}

export default LatestDestinationCard;
