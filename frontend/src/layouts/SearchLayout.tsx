import Footer from "../components/Footer";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

interface Props {
  children: React.ReactNode;
}

function SearchLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="mb-10">
        <Header />
      </div>

      <div className="container mx-auto mt-[35%] sm:mt-[25%] md:mt-[12%] xl:mt-[7%]">
        <SearchBar />
      </div>

      <div className="mt-[8%]">{children}</div>
      
      <Footer />
    </div>
  );
}

export default SearchLayout;
