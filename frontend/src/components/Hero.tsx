import HeroImage from "../assets/Hero.jpg";
import SearchBar from "./SearchBar";

function Hero() {
  return (
    <>
      <section className=" relative">
        {/* Container */}
        <div className="px-5 pt-16 md:px-10 md:pt-20 h-[70%] mt-6 rounded-sm mb-72 md:mb-40 lg:mb-10">
          {/* Component */}
          <div className="  mx-auto max-w-7xl text-center ">
            <div className="relative h-screen w-full rounded-sm">
              <img
                src={HeroImage}
                alt="Background Image"
                className="object-cover object-center w-full h-[80%] rounded-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 h-[80%] rounded-sm"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-top mt-20 sm:mt-40   ">
                <div className="mx-9 sm:mx-0">
                  <h2 className="mx-auto max-w-4xl flex-col text-4xl text-white font-bold  mb-6 md:mb-7 md:text-6xl lg:mb-8 ">
                    Find Your Next Stay,{" "}
                    <span className="text-emerald-500"> Book Now!</span>
                  </h2>
                  <p className="mx-auto  max-w-2xl text-md text-white sm:text-xl font-[500] mb-8 md:mb-12">
                    Discover the perfect accommodations for any trip. Explore
                    and secure your next stay in just a few clicks. Start your
                    journey with Nexstay today!
                  </p>
                </div>

                {/* Search Bar */}
                <div className="absolute sm:w-[96%] mt-56 sm:mt-24 top-28 md:top-1/3 lg:top-1/3 2xl:top-2/4">
                  <SearchBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
