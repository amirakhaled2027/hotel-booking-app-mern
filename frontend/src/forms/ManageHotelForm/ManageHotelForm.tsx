import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

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
    adultCount: number;
    childCount: number;
}

type Props = {
  onSave: (HotelFormData: FormData) => void;
  isLoading: boolean;
}

function ManageHotelForm({ onSave, isLoading }: Props) {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit } = formMethods;

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
      // console.log(formData);

      //create a new form data object and call our API
      
      //to create a form data object:
      const formData = new FormData();
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


