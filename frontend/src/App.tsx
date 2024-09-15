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

function App() {
  
  const {isLoggedIn} = useAppContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />

        <Route path="/search" element={<Layout>Search Page</Layout>} />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route 
              path="/add-hotel" 
              element={
                <Layout>
                  <AddHotel/>
                </Layout>
              } />
          </>
        )}

        {/* it doesn't matter too much where you put the roots and just make sure that any roots that you add  */}
        {/* is above the catch-all roots coz these run in order, so we wanna the catch-all root to be at the end */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
