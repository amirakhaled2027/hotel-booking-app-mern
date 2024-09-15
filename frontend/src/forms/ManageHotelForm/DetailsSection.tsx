import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm";

function DetailsSection() {
    //this is the context we define in ManageHotelForm when we wrapped our code in the providers
    const {
      register,
      formState: { errors },
    } = useFormContext<HotelFormData>();
  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>

        {/* working on the name field */}
        <label className="text-gray-700 text-sm font-bold flex-1">
            Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>

      {/* working on the city and country field */}
      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
                City
            <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", { required: "This field is required" })}
            />
            {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
            )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
                Country
            <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", { required: "This field is required" })}
            />
            {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
            )}
        </label>
      </div>

      {/* working on the description field */}
      <label className="text-gray-700 text-sm font-bold flex-1">
                Description
            <textarea
            // instead of type, define rows: how many rows we want to display in our textarea
            rows={5}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("description", { required: "This field is required" })}
            />
            {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
            )}
        </label>

      {/* working on the price per night field */}
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Price Per Night
            <input
            type="number"
            min={1}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("pricePerNight", { required: "This field is required" })}
            />
            {errors.pricePerNight && (
            <span className="text-red-500">{errors.pricePerNight.message}</span>
            )}
        </label>

      {/* working on star rating field */}
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Star Rating
            <select {...register("starRating", {
                required: "This field is required",
            })}
            className="border rounded w-full p-2 text-gray-700 font-normal"
            >
                <option value="" className="text-sm font-bold">
                    Select as Rating
                </option>
                {[1,2,3,4,5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
            {errors.starRating && (
            <span className="text-red-500">{errors.starRating.message}</span>
            )}
        </label>
        
    </div>
  )
}

export default DetailsSection
