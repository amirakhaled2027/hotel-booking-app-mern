import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import locationIcon from "../assets/locationIcon.svg";
import adultIcon from "../assets/adultIcon.svg";
import childrenIcon from "../assets/childrenIcon.svg";
import calenderIcon from "../assets/calenderIcon.svg";

function SearchBar() {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(
    // Calculating the initial checkOut
    checkIn
      ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)
      : search.checkOut
  );
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
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="py-8 px-5 bg-emerald-500 grid justify-items-center w-56 mx-auto sm:w-[55%] md:w-[70%] lg:w-[75%] 2xl:w-full sm:grid-cols-1 sm:justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr] p-3  rounded shadow-md  items-center gap-4 rounded-sm"
    >
      <div>
        <div className="flex gap-2 items-center mb-2 ">
          <img src={locationIcon} className="w-5 h-5 font-bold" />
          <p className="text-xl text-white font-medium ">Location</p>
        </div>
        <div className="flex flex-row items-center flex-1 bg-white p-7 w-48 rounded-sm">
          <label>
            <input
              placeholder="Type Location"
              className="text-md w-full focus:outline-none"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div>
        <div className="flex gap-2 items-center mb-2">
          <img src={adultIcon} className="w-5 h-5 font-bold" />
          <p className="text-xl text-white font-medium">Adults</p>
        </div>
        <div className="flex flex-row items-center flex-1 bg-white p-6 w-48 rounded-sm">
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
      </div>

      <div>
        <div className="flex gap-2 items-center mb-2">
          <img src={childrenIcon} className="w-5 h-5 font-bold" />
          <p className="text-xl text-white font-medium">Children</p>
        </div>
        <div className="flex flex-row items-center flex-1 bg-white p-6 w-48 rounded-sm">
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
      </div>

      {/* start date */}
      <div>
        <div className="flex gap-2 items-center mb-2">
          <img src={calenderIcon} className="w-5 h-5 font-bold" />
          <p className="text-xl text-white font-medium">Check-in</p>
        </div>
        <div>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Start Date"
            className="flex flex-row items-center flex-1 bg-white p-7 w-48 rounded-sm"
            wrapperClassName="min-w-fill"
          />
        </div>
      </div>

      {/* end date */}
      <div>
        <div className="flex gap-2 items-center mb-2">
          <img src={calenderIcon} className="w-5 h-5 font-bold" />
          <p className="text-xl text-white font-medium">Check-out</p>
        </div>
        <div>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="End Date"
            className="flex flex-row items-center flex-1 bg-white p-7 w-48 rounded-sm"
          />
        </div>
      </div>

      <button className=" bg-amber-500 text-white py-3 px-10 mt-8 font-bold text-xl hover:bg-amber-600 rounded-sm">
        Search
      </button>
    </form>
  );
}

export default SearchBar;