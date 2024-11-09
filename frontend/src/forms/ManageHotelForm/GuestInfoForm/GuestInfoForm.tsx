import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../../contexts/SearchContext";
import { useAppContext } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    //the default values is what the initial values are
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: new Date(search.checkIn.getTime() + 24 * 60 * 60 * 1000),
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); //one year from now

  const onSignInClick = (data: GuestInfoFormData) => {
    //passing in all stuff from the form
    //since the destination doesn't matter, I can use instead an empty string
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in"), { state: { from: location } };
  };

  //THE FUNCTION THAT GETS CALLED WHEN THEY ARE SIGNED IN
  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="w-full 2xl:w-[100%] p-5  rounded-sm bg-white  border-8 border-zinc-100  ">
      <div className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-1.5 flex items-center mb-5">
        <span className="text-base font-medium text-emerald-500 pr-1">
          Price:
        </span>
        <h3 className="text-md font-bold">${pricePerNight}</h3>
      </div>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-1.5 flex-col sm:flex-row items-center">
            <span className="text-base font-medium text-emerald-500 pr-1">
              Check-in:
            </span>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="check-in Date"
              className=" bg-transparent focus:outline-none"
            />
          </div>
          <div className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-1.5 flex-col sm:flex-row items-center ">
            <span className="text-base font-medium text-emerald-500 pr-1">
              Check-out:
            </span>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="check-out Date"
              className=" bg-transparent focus:outline-none "
            />
          </div>

          <label className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-1.5 flex items-center">
            <span className="text-base font-medium text-emerald-500 pr-1">
              Adults:
            </span>
            <input
              type="number"
              className="bg-transparent focus:outline-none font-bold ml-2"
              min={1}
              max={20}
              {...register("adultCount", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "There must be at least one adult",
                },
                valueAsNumber: true,
              })}
            />
          </label>

          <label className="font-medium border-2 border-emerald-500 bg-zinc-100 rounded-lg p-1.5 flex items-center">
            <span className="text-base font-medium text-emerald-500 pr-1">
              Children:
            </span>
            <input
              type="number"
              className="bg-transparent focus:outline-none font-bold ml-2"
              min={0}
              max={20}
              {...register("childCount", {
                valueAsNumber: true,
              })}
            />
          </label>
          {/* displaying an error message, if there aren't the correct amount of adults */}
          {errors.adultCount && (
            <span className="text-red-500 font-semibold text-sm">
              {errors.adultCount.message}
            </span>
          )}
          {/* THE BUTTON */}
          {/* If the user is logged in: BOOK NOW */}
          {/* If the user isn't logged in: SIGN IN TO BOOK */}
          {isLoggedIn ? (
            <button className="bg-amber-500 text-white text-xl font-semibold rounded-sm py-3 px-5 mt-3 hover:bg-amber-600">
              Book Now
            </button>
          ) : (
            <button className="bg-amber-500 text-white text-xl font-semibold rounded-sm py-3 px-5 mt-3 hover:bg-amber-600">
              Sign In to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GuestInfoForm;
