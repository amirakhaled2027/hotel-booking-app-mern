import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../../contexts/SearchContext";
import { useAppContext } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";


type Props = {
    hotelId: string;
    pricePerNight: number;
}

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
}

//up until now, we haven't done very much validation on the search bar 
//coz we want the user to be able to view hotels and things without 
//too much limits
//BUT NOW THAT we're on the details page, we'll need to ensure that 
//they enter valid dates, and guest count before they can continue
//SO, we will hide the guest info form into the react hooks form package

function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  //getting some stuff we we need from useForm hook, that we need to make our form to work
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    //the default values is basically what the initial values are
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  //this is gonna say one year from now
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  //when we click Sign In to Book, it's gonna validate the form as usual
  //but then it's gonna take the user to the sign in page and save their
  //chosen value into the search context that way whenever we bring them
  //back to this page after they've logged in we can pre-populate this
  //form with their chosen value

  //THIS IS THE FUNCTION THAT GETS CALLED WHEN THEY'RE NOT SIGNING IN
  //this function is gonna take the data from the form
  //and whenever the user submits the form the validation and all that
  //stuff will kick in using the handleSubmit function
  //and it'll call our function with the data if the form is valid
  const onSignInClick = (data: GuestInfoFormData) => {
    //we'll pass in all stuff from the form
    //and since the destination doesn't matter, we can use instead an empty string
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
    );
    //after saving the values, we wanna take them to the sign in page
    //then we can pass some state to this which is done by the react router package
    navigate("/sign-in"), { state: { from: location }};
  };

  //THE FUNCTION THAT GETS CALLED WHEN THEY ARE SIGNED IN
  const onSubmit = (data: GuestInfoFormData) => {
    //we'll pass in all stuff from the form
    //and since the destination doesn't matter, we can use instead an empty string
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
    );
    //instead of taking them to the sign in page, we'll take them to the hotel page
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">${pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              //these specify what the user can and can't select
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none"
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              //these specify what the user can and can't select
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
            />
          </div>

          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Adults:
              <input
                type="number"
                className="w-full p-1 focus:outline-none font-bold"
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
          </div>

          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Children:
              <input
                type="number"
                className="w-full p-1 focus:outline-none font-bold"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {/* displaying an error message, if we don't have the correct amount of adults */}
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {/* THE BUTTON */}
          {/* If you're logged in: BOOK NOW */}
          {/* I you're not: SIGN IN TO BOOK */}
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign In to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GuestInfoForm

//pre-populate these fields with whatever we have in the search bar (what the user entered in the search bar previously)

//add some logic to the sign in page that tells us to read the state 
//that we saved in react-router-dom where we saved the user's location
