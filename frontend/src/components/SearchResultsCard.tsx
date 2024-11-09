import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import LocationIconGreen from "../assets/locationIconGreen.svg";
import StarIcon from "../assets/starIcon.svg";

type Props = {
  hotel: HotelType;
};

function SearchResultsCard({ hotel }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] border border-zinc-300 rounded-lg p-8 gap-8 mt-2">
      {/* a div for the image */}
      <div className="relative w-full h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center rounded-sm"
        />
        <div className="absolute top-0 left-0 bg-zinc-400 bg-opacity-70 text-white px-4 py-1 m-2 rounded-lg text-xs font-medium">
          {hotel.type}
        </div>
      </div>

      {/* separating the details section into four rows */}
      <div className="grid sm:grid-rows-[1fr_2fr_1fr_1fr] gap-4 sm:gap-0">
        {/* First Row */}
        <div>
          {/* stars rating  & hotel type*/}
          <div className="flex-row  sm:flex justify-between mb-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1 mb-1 sm:mb-0">
              <img src={LocationIconGreen} alt="" className="w-4" />
              {hotel.country}, {hotel.city}
            </span>
            <span className="flex items-center gap-1">
              <img src={StarIcon} alt="" className="w-4" />
              {hotel.starRating}
            </span>
          </div>
          {/* the hotel's name */}
          <Link
            to={`/details/${hotel._id}`}
            className="text-2xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
        </div>

        {/* Second Row */}
        <div>
          <div className="line-clamp-4 text-base md:text-base sm:text-sm xs:text-xs w-[95%] sm:w-full">
            {hotel.description}
          </div>
        </div>

        {/* Third Row */}
        <div className="items-end whitespace-nowrap">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-1 items-start">
            {" "}
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="bg-amber-500 py-2 px-3 rounded-lg font-semibold text-xs text-white whitespace-nowrap"
              >
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {hotel.facilities.length > 3 &&
                ` +${hotel.facilities.length - 3} more`}
            </span>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="flex flex-col gap-1 sm:flex-row items-end justify-between whitespace-nowrap">
          <span className="font-bold text-lg text-emerald-500">
            ${hotel.pricePerNight}
            <span className="text-black">/night</span>
          </span>
          <Link
            to={`/detail/${hotel._id}`}
            className="bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-bold py-2 px-4 rounded"
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SearchResultsCard;
