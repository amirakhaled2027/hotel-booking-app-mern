import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";

function Home() {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  //this is gonna take all the hotels starting at index 2 (which is essentially gonna take the rest of the hotels)
  const rowHotels = hotels?.slice(2) || [];

  return (
    <section>
      {/* Container */}
      <div className="px-5 md:px-10 mt-72 sm:mt-28 mb-20 md:mt-0 h-[70%] rounded-sm ">
        {/* Component */}
        <div className="  mx-auto max-w-7xl ">
          <h2 className="text-5xl font-bold text-emerald-500 mb-8">
            Latest Destinations
          </h2>
          <p className="text-2xl font-medium mb-10">
            Most recent destinations added by our hosts
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-10">
            {rowHotels.map((hotel) => (
              <LatestDestinationCard hotel={hotel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
