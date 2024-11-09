import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import adultIcon from "../../assets/adultIcon.svg";
import childrenIcon from "../../assets/childrenIcon.svg";

function GuestSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-500 mb-5">Guests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 p-6 gap-5 bg-emerald-500 rounded-sm">
        {/* the adults field */}
        <label className="text-gray-700 text-sm font-semibold ">
          <div className="flex gap-2 items-center mb-2">
            <img src={adultIcon} className="w-6 h-6 font-bold" />
            <p className="text-2xl text-white font-medium">Adults</p>
          </div>
          <input
            className="border rounded w-full py-2 px-3 font-normal rounded-sm focus:outline-none focus:ring-4 focus:ring-amber-500"
            type="number"
            min={1}
            {...register("adultCount", {
              required: "This field is required",
            })}
          />
          {errors.adultCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.adultCount?.message}
            </span>
          )}
        </label>

        {/* the children field */}
        <label className="text-gray-700 text-sm font-semibold">
          <div className="flex gap-2 items-center mb-2">
            <img src={childrenIcon} className="w-6 h-6 font-bold" />
            <p className="text-2xl text-white font-medium">Children</p>
          </div>
          <input
            className="border rounded w-full py-2 px-3 font-normal rounded-sm focus:outline-none focus:ring-4 focus:ring-amber-500"
            type="number"
            min={0}
            {...register("childCount", {
              required: "This field is required",
            })}
          />
          {errors.childCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.childCount?.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
}

export default GuestSection;
