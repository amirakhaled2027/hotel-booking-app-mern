import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
}

type Props = {
  //this line is added after working on edit hotel page
  //and this is gonna cause you to make a lot of changes in this code in this file
  // hotel? : is to make the hotel prop optional 
  //reason: because we only receive a hotel when we're on the edit page, so we're editing an existing hotel,
  //where's on the ad page we won't receive a hotel prop
  hotel?: HotelType;
  onSave: (HotelFormData: FormData) => void;
  isLoading: boolean;
}

function ManageHotelForm({ onSave, isLoading, hotel }: Props) {
    const formMethods = useForm<HotelFormData>();
    //the reset function means reset the form with some new data
    const { handleSubmit, reset } = formMethods;

    //whenever this component receives some new hotel data
    //the the useEffect hook is gonna run and it's gonna reset the form of whatever the hotel data is 
    useEffect(()=> {
      reset(hotel);
       //and because we hotel to our dependency array 
       //what this will do is run anytime the hotel changes 
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
      // console.log(formData);

      //create a new form data object and call our API
      
      //to create a form data object:
      const formData = new FormData();
      //if we're in edit mode or on edit page then we'll have a hotel
      //and if we do have a hotel then we want to add the hotel._id to the form data
      //we need to know the hotelId so that our endpoint request will work
      if (hotel) {
        formData.append("hotelId", hotel._id);
      }
      formData.append("name", formDataJson.name);
      formData.append("city", formDataJson.city);
      formData.append("country", formDataJson.country);
      formData.append("description", formDataJson.description);
      formData.append("type", formDataJson.type);
      formData.append("pricePerNight", formDataJson.pricePerNight.toString());
      formData.append("starRating", formDataJson.starRating.toString());
      formData.append("adultCount", formDataJson.adultCount.toString());
      formData.append("childCount", formDataJson.childCount.toString());
      //Then the more complicated ones
      //First the facilites; because we can have any number of facilities that's more than one, we need to use a forEach
      formDataJson.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility);
      });

      //Second appending the images
      //specifying an image of an array that gets added to the form request
      //and so this is fine for whenever the user is adding images on the AddHotel Page & EditHotel page 
      //so whenever we're in edit mode or on the edit page then we wanna make sure that we sent back the most up-to-date image urls 
      //so those are the existing images that the user added whenever they added a hotel in the first place so we can save those as well and don't get lost on the backend
      //to do this, we're adding a line just above this array
      if(formDataJson.imageUrls) {
        formDataJson.imageUrls.forEach((url, index) => {
          formData.append(`imageUrls[${index}]`, url);
        });
      }
      Array.from(formDataJson.imageFiles).forEach((imageFile) => {
        formData.append(`imageFiles`, imageFile);
      });
      onSave(formData);
    });
    
  return (
    //instead of destruction the register function ...etc, from the useForm(), we're just assigning everything to a variable
    // and the reason we're doing this, we've broken our form up into smaller components
    // so we need to use what's called a form provider so our child components can get access to all the react hook form methods
    //{...forMethods} : we're getting all the stuff out of use form assigning it to the form method,
    // and then we're spreading all those properties onto the form provider, so whenever we create our individual child sections inside of this form
    //then we will be able to use all these methods and functions that we get from the useForm hook
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disables:"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
}

export default ManageHotelForm


