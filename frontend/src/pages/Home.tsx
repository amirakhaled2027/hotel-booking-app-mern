import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import LatestDestinationCard from '../components/LatestDestinationCard';

function Home() {
    const { data: hotels } = useQuery("fetchQuery", () => apiClient.fetchHotels());

    //this is gonna take the first two items from the hotels array
    //and create a new array which we will assign to the top row hotels
    const topRowHotels = hotels?.slice(0, 2) || [];
    //this is gonna take al the hotels starting at index 2 (which is essentially gonna take the rest of the hotels)
    const bottomRowHotels = hotels?.slice(2) || [];


  return (
    <div className='space-y-3'>
        <h2 className='text-3xl font-bold'>Latest Destination</h2>
        <p>Most recent destinations added by our hosts</p>
        <div className='grid gap-4'>
            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                {topRowHotels.map((hotel) => (
                    <LatestDestinationCard hotel={hotel}/>
                ))}
            </div>
            <div className='grid md:grid-cols-3 gap-4'>
                {bottomRowHotels.map((hotel) => (
                    <LatestDestinationCard hotel={hotel}/>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Home