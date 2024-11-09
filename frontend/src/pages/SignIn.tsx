import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RegisterImage from "../assets/register.png";

export type SignInFormData = {
  email: string;
  password: string;
};

function SignIn() {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign In Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16 mx-auto max-w-7xl text-center mt-[30%] sm:mt-[15%] md:mt-[2%] px-5 md:px-10 items-center">
      {/* Register Image */}
      <div className="mx-auto max-w-7xl text-center">
        <div className="relative h-[70%]">
          <img
            src={RegisterImage}
            alt="Background Image"
            className="object-cover object-center rounded-lg h-[70%] sm:h-[90%] filter brightness-75"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center justify-top mt-[40%] sm:mt-[60%] lg:mt-[90%] mx-8">
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

      {/* Register Form */}
      <div className="mx-auto ml-[3%] md:ml-0 mr-5 w-[90%] flex flex-col text-center mb-14 sm:mb-0 ">
        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-10">
          Welcome Back!
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-6 border border-zinc-300 rounded-sm p-7 md:border-none"
        >
          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="email"
              className="text-md text-black font-semibold mr-2 mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="user1@gmail.com"
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              {...register("email", { required: "This field is required" })}
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
              placeholder="123456"
              className="w-full px-3 border-emerald-500 py-2 rounded-sm border-2 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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

          <button
            type="submit"
            className="text-white bg-amber-500 hover:bg-amber-600  font-medium rounded-lg text-sm px-4 py-3 text-center  mr-2 mt-6"
          >
            Sign In
          </button>

          <div className="text-center font-semibold -mt-2">
            <span className="text-sm text-black ">Don't have an account? </span>
            <Link
              to="/register"
              className="text-emerald-500 hover:text-emerald-600"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
