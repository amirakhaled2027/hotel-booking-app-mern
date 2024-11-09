import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import SortDropdown from "../components/SortDropdown";

function Search() {
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const search = useSearchContext();

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((type) => type !== hotelType)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section>
      <div className="relative px-0 md:px-10 mt-20 md:mt-0 h-[70%] rounded-sm ">
        <div className="mx-auto max-w-7xl ">
          <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-5">
            <div className=" z-50 sm:z-0 rounded-sm sm:rounded-lg sm:bg-transparent border-slate-300 p-0 sm:p-5 sm:h-fit sticky top-1 sm:top-24">
              {/* Navigation Drawer */}
              <div
                className={`fixed sm:sticky top-0.5 sm:top-10 left-0 z-50 w-64 bg-white rounded-lg border-slate-300 p-5 h-fit overflow-y-auto transition-transform duration-300 ease-in-out ${
                  isMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full sm:translate-x-0"
                } sm:relative sm:w-auto sm:top-auto h-full sm:border sm:bg-white`}
              >
                <div className="space-y-5 mt-2">
                  <h3 className="flex justify-between text-2xl font-semibold border-b border-slate-300 pb-5 text-emerald-600">
                    Filter by:
                    {/* Hamburger Menu Open & Close Button */}
                    <button
                      onClick={toggleMenu}
                      className=" left-0 my-2 rounded-md  text-emerald-600 focus:outline-none hover:text-amber-500 sm:hidden"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </h3>

                  <PriceFilter
                    selectedPrice={selectedPrice}
                    onChange={(value?: number) => setSelectedPrice(value)}
                  />
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
                </div>
              </div>
            </div>

            <div className="flex flex-col m-2 sm:m-0">
              <div className="grid  grid-rows-2 md:grid-cols-[4fr_1fr] items-center p-3 ">
                {/* Hamburger Menu Open & Close Button */}
                <button
                  onClick={toggleMenu}
                  className=" left-0 my-2 rounded-md  text-emerald-600 focus:outline-none hover:text-amber-500 sm:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <span className="text-2xl font-bold">
                  Hotels found in
                  <span className="text-amber-500">
                  {search.destination ? ` ${search.destination}` : " "}
                  </span>
                </span>

                <div className="">
                  {/* Replace the select with SortDropdown */}
                  <SortDropdown
                    sortOption={sortOption}
                    onChange={setSortOption}
                  />
                </div>
              </div>

              {hotelData?.data.map((hotel) => (
                <SearchResultsCard hotel={hotel} />
              ))}

              <div>
                <Pagination
                  page={hotelData?.pagination.page || 1}
                  pages={hotelData?.pagination.pages || 1}
                  onPageChange={(page) => setPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Search;
