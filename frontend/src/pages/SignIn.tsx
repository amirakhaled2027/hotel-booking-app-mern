import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
}

function SignIn() {
    //import the show toast message
    const {showToast} = useAppContext();
    //importing the useNavigate hook
    const navigate = useNavigate();
    //setting up a form with react-hook-form and extracting the necessary 
    //values to manage the form state and handle form submission.
    const {
      register,
      formState: { errors },
      handleSubmit
    } = useForm<SignInFormData>();

    
    const mutation = useMutation(apiClient.signIn, {
        onSuccess: () => {
            //when the user succeeding sign in, we wanna:
            // 1. show the toast
            // 2. navigate to the homepage
            // console.log('user has been signed in successfully!!')
            showToast({
                message: 'Sign In Successful!',
                type: "SUCCESS"
            });
            setTimeout(() => {
              navigate('/');
              //auto refresh the homepage after 2000ms coz the header doesn't wanna appear unless you manually refresh the page 
              //(discovered this from e2e test)
              window.location.reload();
            }, 2000);
        },
        //if we get any errors back from our backend, we wanna do something with those as well
        // and then react query will give us the (error)
        onError: (error: Error) => {
            //show the toast as well
            showToast({
                message: error.message,
                type: "ERROR"
            })
        } 
    });

    //now we wanna create an onsubmit function that we can link it to our form
    const onSubmit = handleSubmit( (data) => {
        mutation.mutate(data);
    }) 

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <h2 className="text-3xl font-bold">Sign In</h2>

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
      {/* SignIn Button */}
      <span className="flex items-center justify-between">
          <span className="text-sm">
            Not Registered? <Link className="underline" to="/register">Create an account here</Link>
          </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  )
}

export default SignIn