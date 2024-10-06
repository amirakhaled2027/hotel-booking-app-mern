import { Link } from "react-router-dom"
import { HotelType } from "../../../backend/src/shared/types"



//define the types for our props
type Props = {
    hotel: HotelType
}


function LatestDestinationCard({ hotel }: Props) {
  return (
    //this is gonna link us to the hotel details page
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
        <div className="h-[300px]">
            <img src={hotel.imageUrls[0]} className="w-full object-cover object-center" />
        </div>

        <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
            <span className="text-white font-bold tracking-tight text-3xd">
                {hotel.name}
            </span>
        </div>
    </Link>
  );
}

export default LatestDestinationCard