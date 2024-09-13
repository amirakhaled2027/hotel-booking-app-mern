import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";


function SignOutButton() {
  //invalidating the the token from the AppContext file
  //this is a react query hook which let us do all sorts of stuff at the global level
  const queryClient = useQueryClient();
  //importing the toast
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      //this comes from our AppContext.tsx file
      //so whenever we click on signout and this run, it's going to call the signout function 
      //which will give us back an expired token
      //it's then going to force the validate token function to run again 
      //and it will check our expired token 
      //it'll see that the token is expired and then in the AppContext.tsx, the error
      //is gonna be true which means the isLoggedIn is gonna be false
      await queryClient.invalidateQueries("validateToken");
      //showToast
      showToast({ message: "Sign Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      //show toast
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleClick = () => {
    //this invokes the api call
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      Sign Out
    </button>
  );
}

export default SignOutButton