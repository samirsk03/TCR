import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import Wallet from "./pages/Rewards/Wallet";
import Review from "./pages/Review/Review";
import Profile from "./pages/Profile/Profile";
import Offers from "./pages/Offers";
import Cart from "./pages/Cart/Cart";

// Components
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-sbCream">
      {isLoggedIn && <Navbar />}

      <main className="flex-grow pb-24 md:pb-0">
        <Routes>

          {/* Protected */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />


          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Public */}

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      {isLoggedIn && <BottomNav />}
    </div>
  );
}

export default App;