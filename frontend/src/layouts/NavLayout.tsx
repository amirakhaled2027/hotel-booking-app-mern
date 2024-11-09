import Footer from "../components/Footer";
import Header from "../components/Header";

interface Props {
  children: React.ReactNode;
}

function NavLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="mt-[8%]">{children}</div>
      <Footer />
    </div>
  );
}

export default NavLayout;
