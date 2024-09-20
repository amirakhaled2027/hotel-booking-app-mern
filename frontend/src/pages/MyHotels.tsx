import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
 

function MyHotels() {
    //making the fetch request to fetch the hotels added
    //when we call the useQuery hook, it will give us the response body as a variable called data
    //and we just rename the stat as a hotelData as it makes a little bir more sense in this context
    const { data: hotelData } = useQuery(
        "fetchMyHotels", 
        apiClient.fetchMyHotels,
        {
            // onError: () => {},
        }
    );

    //if we don't have any hotel data, then return "No Hotels Found"
    if(!hotelData) {
        return <span>No Hotel found</span>
    }

  return (
    <div className="space-y-5 ">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold hover:bg-blue-500 p-2 "
        >
          Add Hotel
        </Link>
      </span>

      {/* displaying the cards  */}
      {/* <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5" >
            <h2 className="text-2xl font-bold" >{hotel.name}</h2>
            <div className="whitespace-pre-line" >{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" >
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" >
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div> 
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" >
                <BiMoney className="mr-1" />${hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" >
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" >
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div> */}




            
      {/* displaying the cards  */}
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5" key={hotel._id}>
            <h2 className="text-2xl font-bold" key={hotel.name}>{hotel.name}</h2>
            <div className="whitespace-pre-line" key={hotel.description}>{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" key={`${hotel.city}-${hotel.country}`}>
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" key={hotel.type}>
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div> 
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" key={hotel.pricePerNight}>
                <BiMoney className="mr-1" />${hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" key={`${hotel.adultCount}-${hotel.childCount}`}>
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center" key={hotel.starRating}>
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>






            {/* whenever we click the view details link, we're going to redirect the user to the edit hotel page 
                , and we're gonna pass the hotel ID in the URL so then on the edit hotel page we can have some code that
                parses the url, gets the ID and fetches that hotel */}
            <span className="flex justify-end">
            <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyHotels

