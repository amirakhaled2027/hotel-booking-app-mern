import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import TopLayout from "./layouts/NavLayout";
import SearchLayout from "./layouts/SearchLayout";
import NavLayout from "./layouts/NavLayout";

function App() {
  const { isLoggedIn } = useAppContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />

        <Route
          path="/detail/:hotelId"
          element={
            <TopLayout>
              <Detail />
            </TopLayout>
          }
        />

        <Route
          path="/register"
          element={
            <TopLayout>
              <Register />
            </TopLayout>
          }
        />

        <Route
          path="/sign-in"
          element={
            <NavLayout>
              <SignIn />
            </NavLayout>
          }
        />

        {isLoggedIn && (
          <>
            {/* this is for booking confirmation page */}
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <NavLayout>
                  <Booking />
                </NavLayout>
              }
            />

            {/* this is for adding/listing a new hotel */}
            <Route
              path="/add-hotel"
              element={
                <NavLayout>
                  <AddHotel />
                </NavLayout>
              }
            />

            {/* this is for editing the user's hotel */}
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <NavLayout>
                  <EditHotel />
                </NavLayout>
              }
            />

            {/* this is for showing the hotel added in the previous step */}
            <Route
              path="/my-hotels"
              element={
                <SearchLayout>
                  <MyHotels />
                </SearchLayout>
              }
            />

            {/* this is for My Booking Page */}
            <Route
              path="/my-bookings"
              element={
                <SearchLayout>
                  <MyBookings />
                </SearchLayout>
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
