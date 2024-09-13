import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
//import all the functions from an API client as the API client variable and then in the useMutation we will pass this in as the first parameter
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

//we want to tell react hook form what fields our form is going to have
//export they type to be able to use it in the api-client.ts
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const navigate = useNavigate();
  //accessing the Register component to the showToast property from AppContext.jsx
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    //we wanna call the mutation react query when our form is submitted
    mutation.mutate(data);
  });

  //REACT QUERY
  // the reason we use react query here is we don't have to manage any state ourselves
  // as the state is built into the use mutation hook, so we use
  //we're using useMutation coz we're creating something on the backend
  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      // console.log("registration successful!");
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      setTimeout(() => {
        navigate('/');
        //auto refresh the homepage after 2000ms coz the header doesn't wanna appear unless you manually refresh the page 
        //(discovered this from e2e test)
        window.location.reload();
      }, 2000);
      
    },
    onError: (error: Error) => {
      //catch the message from the new Error we created in Register.tsx
      // console.log(error.message);
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
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
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your passwords do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
}

export default Register;


