import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

function DetailsSection() {
  //this is the context in which I define ManageHotelForm when I wrap the code in the providers
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-emerald-500 mb-5">Add Hotel</h1>

      {/* the name field */}
      <label className="text-zinc-600 text-base font-semibold flex-1 space-y-2">
        <span className="text-black">The Name of Your Property</span>
        <input
          type="text"
          className="border border-emerald-500 rounded-sm w-full p-2 font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>

      {/* the city and country field */}
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="text-zinc-600 text-base font-semibold flex-1 space-y-2">
          <span className="text-black">City</span>

          <input
            type="text"
            className="border border-emerald-500 rounded-sm w-full p-2 font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600"
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && (
            <span className="text-red-600">{errors.city.message}</span>
          )}
        </label>
        <label className="text-zinc-600 text-base font-semibold flex-1 space-y-2">
          <span className="text-black">Country</span>

          <input
            type="text"
            className="border border-emerald-500 rounded-sm w-full p-2 font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600"
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <span className="text-red-600">{errors.country.message}</span>
          )}
        </label>
      </div>

      {/* the description field */}
      <label className="text-zinc-600 text-base font-semibold flex-1 space-y-2">
        <span className="text-black">Description</span>

        <textarea
          rows={5}
          className="border border-emerald-500 rounded-sm w-full p-2 font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600"
          {...register("description", { required: "This field is required" })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>

      {/* PRICE PER NIGHT & STAR RATING */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* the price per night field */}
        <label className="text-zinc-600 text-base font-semibold flex-1 space-y-2">
          <span className="text-black">Price Per Night</span>

          <input
            type="number"
            min={1}
            className="border border-emerald-500 rounded-sm w-full p-2 font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600"
            {...register("pricePerNight", {
              required: "This field is required",
            })}
          />
          {errors.pricePerNight && (
            <span className="text-red-500">{errors.pricePerNight.message}</span>
          )}
        </label>

        {/* star rating field */}
        <label className="text-zinc-600 text-base font-semibold flex-1 space-y-2">
          <span className="text-black">Star Rating</span>

          <select
            {...register("starRating", {
              required: "This field is required",
            })}
            className="border border-emerald-500 rounded-sm w-full p-2 font-normal focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="" className="text-sm font-semibold">
              Select as Rating
            </option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.starRating && (
            <span className="text-red-500">{errors.starRating.message}</span>
          )}
        </label>
      </div>
    </div>
  );
}

export default DetailsSection;
