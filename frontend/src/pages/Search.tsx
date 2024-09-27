import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from '../api-client';
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

function Search() {

    //making sure the info that the user added to the search bar is gonna be saved in the useSearchContext()
    const search = useSearchContext();
    //we also have to pass in the page here
    //the page is gonna be different coz we haven't stored the page value anywhere
    //but what we will do is we will store the page in state on the search page itself
    const [page, setPage] = useState<number>(1);
    // related to the filter code/section
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    //added after HotelTypesFilter.tsx
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    //added after FacilitiesFilter.tsx
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    //added after PriceFilter.tsx
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    //added after the sort option code in this file
    //setting it to an empty string so that it defaults to the first value
    const [sortOption, setSortOption] = useState<string>("");
    

    //we've to take the stuff that the user entered into the search form 
    //and we have to convert that stuff into a search parameters object
    //which we will pass to our fetch request 
    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        //passing the page number to our request as well
        page: page.toString(),
        //passing the selected stars to our api call
        stars: selectedStars,
        //passing the selected hotel types to our api call
        types: selectedHotelTypes,
        //passing the selected facilities to our api call
        facilities: selectedFacilities,
        //passing the selected max price to our api call
        maxPrice: selectedPrice?.toString(),
        //passing the selected sort option  to our api call
        sortOption,

    };

    const { data: hotelData } = useQuery(["searchHotels", searchParams], () => 
        apiClient.searchHotels(searchParams)
    );

    //creating a function that gets called whenever the user checks or unchecks one of the stars
    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const starRating = event.target.value;

      //event.target.checked
      //in here: we are running A Conditional Check
      //so we're checking did the user check or uncheck this this checkbox
      //that we get from the event  

      // / ? [...prevStars, starRating]
      //If they did check it, then what we want to do is we wanna copy
      //the previous stars that are currently in state which is an array of
      //strings and then we wanna add the new star that they check to the end 
      //of this array, and then we wanna save this array into state

      //: prevStars.filter((star) => star !== starRating)
      //if they unchecked it and the second part of this is gonna run 
      //and it's basically gonna to take the current stars that are in state 
      //or the previous state of stars
      //and it's gonna filter out the stars that we're just selected 
      //and it's gonna return a new array with all the stars except those stars
      //and set everything into state
      //so we're basically removing the unchecked star from state here, OR adding a new star to state
      setSelectedStars((prevStars) =>
        event.target.checked
          ? [...prevStars, starRating]
          : prevStars.filter((star) => star !== starRating)
      );
    };

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const hotelType = event.target.value;

      setSelectedHotelTypes((prevHotelTypes) => 
        event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((type) => type !== hotelType)
      )
    }
    

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const facility = event.target.value;

      setSelectedFacilities((prevFacilities) => 
        event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
      )
    }
    
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      {/* Filter column */}
      <div className="rounded-lg border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          {/* TO DO FILTERS */}
          {/* update: adding the following code after working on the filter section on the backend, api-client, and frontend */}
          {/* we'll use the useState hook to handle the state of the filters */}
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            //passing an inline function that gonna accept the value as an optional number
            //and then call the setSelectedPrice, and then set the value to whatever it is.
            //since we're working with a single value here, and not working with a complex list of checkboxes,
            //we don't need to have a separate function, we can just do it inline and it should all work the same
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>

      {/* Search result column */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hotel found
            {/* if there's a destination in the search bar, then append this text */}
            {search.destination ? ` in ${search.destination}` : " "}
          </span>
          {/* TO DO SORT OPTIONS */}
          {/* we could create a new component for this, but considering it's just a simple select dropdown and it's gonna be quite a small component, so it's not really necessary to create a new one   */}
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">Price Per Night (low to high)</option>
            <option value="pricePerNightDesc">Price Per Night (high to low)</option>
          </select>
        </div>
        {/* displaying the hotel data */}
        {hotelData?.data.map((hotel) => (
          <SearchResultsCard hotel={hotel} />
        ))}
        {/* adding the pagination */}
        <div>
          {/* || 1 : if something bad happened that results in the page is undefined, we'll just display 1  */}
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default Search

