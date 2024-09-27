import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext"
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css" //for styling the DatePicker Calender
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const navigate = useNavigate()
    const search = useSearchContext();

    //get the search values from the context if any exist 
    //and store them in some local state in this component 

    //we don't wanna save the local state of the form fields in the search context
    //as the user is typing as it'll cause the entire app rerender anytime the user
    //changes any of the inputs which would give us a bit of a performance hit 
    //so what we wanna do instead is to store the values they selected in these local state variables 
    //in the SearchBar component, and whenever they submit the form by clicking the search button 
    //then we know that they're finished filling out the fields in the form
    //and this is when we save the local values to the global state useSearchContext()
    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(
          destination,
          checkIn,
          checkOut,
          adultCount,
          childCount
        );
        //taking the user to the search page whenever we submit the search bar form
        navigate("/search");
    }


    //this means today they can't select, so they can't select any date in the paste
    const minDate = new Date();
    //the max date is gonna be one year from now
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);


    //although we're using a form here, we aren't gonna use react-hook-form 
    //since we don't need all of the features that react-hook-form will give us 
    // so since the form is quite controlled and there's a date picker and a number input
    //and we don't need validation then it's a bit more straight forward of a form 
    //so we don't need to ove complicate things

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid gird-cols-2 lg:gird-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="where are you going?"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Adults:
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
      </div>

      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Children:
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
          />
        </label>
      </div>

      {/* start date */}
      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
         //these specify what the user can and can't select
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-fill"
        />
      </div>
      
      {/* end date */}
      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
         //these specify what the user can and can't select
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
        />
      </div>

      {/* search button */}
      <div className="flex gap-1">
        <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">
            Search
        </button>
      </div>

      {/* clear button */}
      <div className="flex gap-1">
        <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
            Clear
        </button>
      </div>


    </form>
  );
}

export default SearchBar