import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />

      <div className="mt-[20%] sm:mt-[10%] md:mt-0">
        <Hero />
      </div>

      <div className="">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;
