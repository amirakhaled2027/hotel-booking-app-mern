import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../assets/register.png";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    mutation.mutate(data);
  });

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      // console.log("registration successful!");
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      //to update the query
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-[1fr_1fr] gap-16  mx-auto max-w-7xl text-center mt-[30%] sm:mt-[15%] md:mt-[2%] px-5 md:px-10 items-center">
      {/* Register Form */}
      <div className="  mx-auto ml-0 mr-5 -mt-5 sm:-mt-16 md:mt-0 w-[90%]  flex flex-col text-center order-last md:order-first">
        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-10">
          Create An Account
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-6 border border-zinc-300 rounded-sm p-7 md:border-none mb-14 sm:mb-0 ml-[7%] md:ml-0"
        >
          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="firstName"
              className="text-md text-black font-semibold mr-2 mb-2"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2  focus:outline-none focus:ring-1 focus:ring-emerald-600"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="lastName"
              className="text-md text-black font-semibold mr-2 mb-2"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", { required: "This field is required" })}
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2  focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName.message}</span>
            )}
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="email"
              className="text-md text-black font-semibold mr-2 mb-2"
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              {...register("email", { required: "This field is required" })}
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2  focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="password"
              className="text-md text-black font-semibold mr-2 mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2  focus:outline-none focus:ring-1 focus:ring-emerald-600"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="confirmPassword"
              className="text-md text-black font-semibold mr-2 mb-2"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2  focus:outline-none focus:ring-1 focus:ring-emerald-600"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) {
                    return "This field is required";
                  } else if (watch("password") !== val) {
                    return "Your passwords do no match";
                  }
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium mt-8 py-2 px-4 rounded-lg shadow-sm"
          >
            Register
          </button>

          <div className="-mt-2 text-center font-semibold">
            <span className="text-sm text-black ">
              Already have an account?{" "}
            </span>
            <Link
              to="/sign-in"
              className="text-emerald-500 hover:text-emerald-600"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>

      {/* Register Image */}
      <div className="  mx-auto max-w-7xl text-center order-first md:order-last">
        <div className="relative h-[70%] ">
          <img
            src={RegisterImage}
            alt="Background Image"
            className="object-cover object-center rounded-lg  sm:h-[90%] filter brightness-75"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-top mt-[40%] sm:mt-[80%] mx-8 h-[10%] sm:h-[90%]   ">
            <h2 className="mx-auto max-w-4xl flex-col text-3xl sm:text-5xl text-white font-bold md:mb-7 md:text-4xl mb-6 lg:mb-8">
              Find Your Next Stay,{" "}
              <span className="text-emerald-500"> Book Now!</span>
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-md text-white text-sm sm:text-md font-[500] md:mb-12">
              Discover the perfect accommodations for any trip. Explore and
              secure your next stay in just a few clicks. Start your journey
              with Nexstay today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
