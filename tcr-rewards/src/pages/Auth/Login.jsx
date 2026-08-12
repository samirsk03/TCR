// src/pages/Auth/Login.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setIsSubmitting(true);

    try {
      await login({
        phone: formData.phone,
        password: formData.password,
      });

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login Failed"
      );

    } finally {

      setIsSubmitting(false);

    }
  };

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">

      <div className="w-full max-w-lg">

        <h1 className="text-3xl md:text-4xl font-bold text-sbDark mb-4 text-center">
          Sign In
        </h1>

        <p className="text-gray-500 mb-12 text-center text-sm font-medium tracking-widest uppercase">
          Welcome Back
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-sb border border-gray-100 space-y-10"
        >

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-3">

              <AlertCircle size={20} />

              {error}

            </div>
          )}

          <div>

            <input
              type="tel"
              required
              className="sb-input"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />

          </div>

          <div>

            <input
              type="password"
              required
              className="sb-input"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />

          </div>

          <div className="flex flex-col gap-8 pt-4">

            <Link
              to="/reset-password"
              className="text-sbGreen font-bold hover:underline w-fit"
            >
              Forgot Password?
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="sb-btn-black py-5 rounded-full text-xl shadow-xl w-full md:w-fit md:px-12 self-end"
            >
              {isSubmitting ? (
                <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full block mx-auto"></span>
              ) : (
                "Sign In"
              )}
            </button>

          </div>

        </form>

        <div className="mt-16 text-center">

          <h2 className="text-sbGreen font-bold text-xl mb-4 uppercase tracking-widest text-xs">
            New to The Chocolate Room Rewards?
          </h2>

          <p className="text-gray-500 mb-8 max-w-xs mx-auto">
            Join now and start earning reward points on every order.
          </p>

          <Link
            to="/signup"
            className="sb-btn-outline-green py-3 px-8 text-lg"
          >
            Join Now
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Login;