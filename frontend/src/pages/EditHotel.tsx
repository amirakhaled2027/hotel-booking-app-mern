import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom"
import * as apiClient from '../api-client';
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";


function EditHotels() {

    //to pass the id of the user that its editing his page
    const { hotelId } = useParams();
    const { showToast } = useAppContext();

    //using react query to call our fetch request we just created 
    const { data: hotel } = useQuery(
      "fetchMyHotelById", 
      () => apiClient.fetchMyHotelById(hotelId || ''),
        {
          //this query is only gonna run if we have a hotelId
          //the double exclamation mark(!!) means: is a check fro a trophy value
          //so if hotelId has a value, then this little expression is gonna return true
          //but if the hotelId is undefined or empty string or null then this is going
          //to evaluate to false which means enabled will be false as well
          enabled: !!hotelId,
        }
    );

    //using the useMutation hook to call our put request
    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
      onSuccess: () => {
        showToast({ message: "Hotel Saved!", type: "SUCCESS"});
      }, 
      onError: () => {
        showToast({ message: "Error Saving Hotel", type: "ERROR"});
      },
    });

    //creating the function that we pass to the manageHotelForm onSave prop
    const handleSave = (hotelFormData: FormData) => {
      mutate(hotelFormData);
    };

  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
  )
}

export default EditHotels


