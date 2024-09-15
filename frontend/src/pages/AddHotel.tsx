import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from '../api-client';

function AddHotel() {
  const { showToast } = useAppContext();
  //creating the actual API call for the form that we created in the ManageHotelForm.tsx
  //using useMutation to add our hotel endpoint
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },    
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR"});
    }
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData)
  }

  return     <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>

    //EXPLANATION
    //we're gonna add the ManageHotelForm in its own component 
    //REASON: because it will this form reusable so:
    //1. whenever we come to make the edit hotel page, we can use the same form
    //2. it keeps all of the logic and components needed to create and edit a hotel in the same component

}

export default AddHotel;

