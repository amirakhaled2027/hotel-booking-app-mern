import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types"
import { Link } from "react-router-dom";


type Props = {
    hotel: HotelType;
}
function SearchResultsCard({hotel}: Props) {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      {/* a div for the image */}
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* separating the details section into three rows */}
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        {/* TOP ROW */}
        <div>
          {/* stars rating */}
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map(() => (
                <AiFillStar className="fill-yellow-400" />
              ))}
            </span>
            {/* hotel type */}
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
          {/* the hotel's name */}
          <Link
            to={`/details/${hotel._id}`}
            className="text-2xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
        </div>

        {/* MIDDLE ROW */}
        <div>
          <div className="line-clamp-4">{hotel.description}</div>
        </div>

        {/* LAST ROW */}
        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          <div className="flex gap-1 items-center">
            {/* take the first three facilities depending on the values we entered 
             and once we got the first three items in a new array, we're gonna use the map */}
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span key={facility} className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {hotel.facilities.length > 3 &&
                ` +${hotel.facilities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold">${hotel.pricePerNight} per night</span>
            <Link to={`/detail/${hotel._id}`} className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500">
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultsCard

