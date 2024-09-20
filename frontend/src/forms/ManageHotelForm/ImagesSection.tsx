import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

function ImagesSection() {
    const {
      register,
      formState: { errors },
      //displaying existing images that the user has added to the hotel
      //so that they can see them whenever they add that hotel

      //since we're handling this a bit differently and we're not working with inputs
      //we have to get the image URLs from our hotel from data in a different way
      //so even though we're not working with forms inputs, we initialize this form
      //with the hotel data that we got back from our get request whenever the edit page loads
      //so the form is storing the image urls that came back in the response as well
      //to get those, we have to restructure the watch function from our useFormContext
      watch,
      //setValue will let us set a specific value 
      setValue,
    } = useFormContext<HotelFormData>();

    //added after using watch in the useFormContext()
    //it will give you an error in the beginning, coz even though storing the image urls in the form,
    //we haven't updated our hotel form data type to L typescript that we are doing this
    //so all we have to do is go into ManageHotelForm.tsx, and in our HotelFormData type
    //after the imageFiles we will add: imageUrls: string[];
    const existingImageUrls = watch("imageUrls");

    //we wanna let the user delete some of the images' urls/images 
    //whenever they click on the delete button
    const handleDelete = (
        //this is how to specify the type of a button click in react
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      imageUrl: string
    ) => {
        //the reason we need the event is because, we're going to click a button 
        //that's inside a form, the default action is to submit the form which is pretty annoying,
        event.preventDefault();

        //we get the image url that we get passed to us in the function
        //we wanna remove that image url from the previous image URLs list that's stored in the form
        //and then we wanna save this updated list back to the form using setValue that we used previously
        setValue("imageUrls", existingImageUrls.filter((url) => url !== imageUrl));

    };


    
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {/* we wanna pick this array of string of image urls and we want to display 
            an image tag for each one */}
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button 
                  //any time we click on the delete button, it's gonna call our handle delete function
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imagesFiles) => {
              const totalLength = imagesFiles.length 
              +
              //we also wanna add the total amount of existing image URLs in here as well
              (existingImageUrls?.length || 0 );

              if (totalLength === 0) {
                return "At least one image should be added";
              }
              if (totalLength > 6) {
                return "Total number of images can't be more than 6";
              }
              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
}


export default ImagesSection

