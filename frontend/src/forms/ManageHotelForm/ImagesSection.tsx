import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

function ImagesSection() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls");

  //giving the users the option to delete some of images whenever they click on the delete button
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();

    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-500 mb-5">Images</h2>
      <div className="border-2 border-emerald-500 rounded-sm  p-4 flex flex-col gap-4 ">
        {existingImageUrls && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
            {existingImageUrls.map((url) => (
              <div className="relative group ">
                <img src={url} className="min-h-full object-cover rounded-sm" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black rounded-sm bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
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
          className="w-full text-zinc-600 font-normal"
          {...register("imageFiles", {
            validate: (imagesFiles) => {
              const totalLength =
                imagesFiles.length +
                //adding the total amount of existing image URLs in here as well
                (existingImageUrls?.length || 0);

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

export default ImagesSection;
