import FooterLogo from "../assets/footerLogo.png";
import { BsFacebook, BsInstagram, BsTiktok, BsTwitterX } from "react-icons/bs";

function Footer() {
  return (
    <div className="bg-emerald-500 rounded-sm m-4">
      <div className="max-w-screen-lg py-10 px-4 sm:px-6 text-white sm:flex justify-between mx-auto">

        {/* Footer First Section */}
        <div className="p-5 sm:w-2/12 border-none sm:border-r">
          <div className="text-sm uppercase text-amber-500 font-bold">Menu</div>
          <ul>
            <li className="my-2">
              <a className="hover:text-amber-500" href="#">
                Home
              </a>
            </li>
            <li className="my-2">
              <a className="hover:text-amber-500" href="#">
                Services
              </a>
            </li>
            <li className="my-2">
              <a className="hover:text-amber-500" href="#">
                Products
              </a>
            </li>
            <li className="my-2">
              <a className="hover:text-amber-500" href="#">
                Pricing
              </a>
            </li>
          </ul>
        </div>

        {/* Footer Middle Section */}
        <div className="p-5 sm:w-7/12 border-none sm:border-r  text-center justify-items-center">
          <img src={FooterLogo} alt="Footer Logo" className="w-96" />
        </div>

        {/* Footer Last Section */}
        <div className="p-5 sm:w-3/12">
          <div className="text-sm uppercase text-amber-500 font-bold">
            Contact Us
          </div>
          <ul>
            <li className="my-2">
              <a className="hover:text-amber-500" href="#">
                XXX XXXX, Egypt
              </a>
            </li>
            <li className="my-2">
              <a className="hover:text-amber-500" href="#">
                contact@company.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex py-5 m-auto text-black text-sm flex-col items-center border-t max-w-screen-xl">
        <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
          <a href="#" className="mx-1">
            <BsInstagram className="text-2xl hover:text-amber-500" />
          </a>
          <a href="#" className="w-6 mx-1">
            <BsTwitterX className="text-2xl hover:text-amber-500" />
          </a>
          <a href="#" className="w-6 mx-1">
            <BsFacebook className="text-2xl hover:text-amber-500" />
          </a>
          <a href="#" className="w-6 mx-1">
            <BsTiktok className="text-2xl hover:text-amber-500" />
          </a>
        </div>
        <div className="my-5">©2024 Nexstay. All rights reserved.</div>
      </div>
    </div>
  );
}

export default Footer;
