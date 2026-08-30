// src/pages/Auth/Signup.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    mpin: "",
    confirmMpin: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (formData.mpin !== formData.confirmMpin) {
      return setError("MPINs do not match.");
    }

    if (formData.mpin.length !== 4) {
      return setError("MPIN must be 4 digits.");
    }

    setIsSubmitting(true);

    try {
      await signup({
        name: formData.name,
        phone: formData.contact,
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Signup Failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-lg">

        <h1 className="text-3xl md:text-4xl font-bold text-sbDark mb-4 text-center">
          Create an account
        </h1>

        <p className="text-sbGreen font-bold mb-10 text-center tracking-widest uppercase text-sm">
          THE CHOCOLATE ROOM® REWARDS
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-sb border border-gray-100 space-y-10"
        >

          {/* Personal Information */}

          <div className="space-y-6">

            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              Personal Information
            </h2>

            <input
              type="text"
              required
              className="sb-input"
              placeholder="* Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              className="sb-input"
              placeholder="Email (Coming Soon)"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="tel"
              required
              className="sb-input"
              placeholder="* Contact Number"
              value={formData.contact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: e.target.value,
                })
              }
            />

          </div>

          {/* Security */}

          <div className="space-y-6">

            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              Security
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-3">

                <AlertCircle size={20} />

                {error}

              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="password"
                required
                className="sb-input"
                placeholder="* Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />

              <input
                type="password"
                required
                className="sb-input"
                placeholder="* Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword:
                      e.target.value,
                  })
                }
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="password"
                maxLength="4"
                required
                className="sb-input"
                placeholder="* 4 Digit MPIN"
                value={formData.mpin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mpin: e.target.value,
                  })
                }
              />

              <input
                type="password"
                maxLength="4"
                required
                className="sb-input"
                placeholder="* Confirm MPIN"
                value={formData.confirmMpin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmMpin:
                      e.target.value,
                  })
                }
              />

            </div>

          </div>

          <div className="flex flex-col gap-8 pt-8">

            <p className="text-xs text-gray-400 leading-relaxed">
              By clicking "Create Account", you agree to
              The Chocolate Room® Rewards Terms &
              Conditions.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="sb-btn-primary py-5 rounded-full text-xl shadow-xl w-full md:w-fit md:px-12 self-end"
            >
              {isSubmitting ? (
                <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full block mx-auto"></span>
              ) : (
                "Create Account"
              )}
            </button>

          </div>

        </form>

        <p className="mt-12 text-center text-gray-500 font-medium">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-sbGreen font-bold hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Signup;