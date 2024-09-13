import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"


// We want to add the props to our layout components and these props will contain 
//the children that get past into the layout 
//we will then render the children in between the header and the footer 
//to achieve the effect we want


//define an interface for the props
//it describes the props that this component expects
interface Props {
  children: React.ReactNode;
}

function Layout({children}: Props) {
  return (
    <div className="flex flex-col min-h-screen">
        <Header/>
        <Hero/>
        <div className="container mx-auto py-10 flex-1">{children}</div>
        <Footer/>
    </div>
  )
}

export default Layout