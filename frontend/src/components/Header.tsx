import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import Logo from "../assets/logo.png";

function Header() {
  const { isLoggedIn } = useAppContext();

  return (
    <>
      <nav className="bg-white bg-opacity-0  fixed w-full z-20 start-0 mt-4 ">
        <div className="bg-zinc-100 rounded-sm max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-1 rtl:space-x-reverse"
          >
            <img src={Logo} className="h-10" alt="Flowbite Logo" />
            <span className="self-center text-3xl font-bold whitespace-nowrap text-emerald-500">
              Nexstay
            </span>
          </Link>
          {isLoggedIn ? (
            <>
              <div className="flex flex-col p-4 md:p-2 mt-4 font-medium  rounded-sm bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                <Link
                  className="flex items-center text-emerald-500 px-3 font-bold hover:text-amber-500"
                  to="/my-bookings"
                >
                  My Bookings
                </Link>
                <Link
                  className="flex items-center text-emerald-500 px-3 font-bold hover:text-amber-500"
                  to="/my-hotels"
                >
                  My Hotels
                </Link>
              </div>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="text-white bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center "
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
