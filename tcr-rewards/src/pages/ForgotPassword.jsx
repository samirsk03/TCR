
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
} from "../services/forgotPasswordService";

import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");

    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetOTP(`+91${phone}`);

      setOtpSent(true);
    } catch (error) {
      console.error(error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyPasswordResetOTP(otp);

      setVerified(true);
    } catch (error) {
      console.error(error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Get Firebase ID token after OTP verification
      if (!window.passwordResetUser) {
        setError("Verification session expired. Please verify OTP again.");
        return;
      }

      const idToken = await window.passwordResetUser.getIdToken();

      await api.post("/auth/reset-password", {
        idToken,
        newPassword,
      });

      alert("Password reset successfully! Please login with your new password.");

      navigate("/login");
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* STEP 1 — PHONE */}
        {!otpSent && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Forgot Password?
            </h1>

            <p className="text-gray-500 mb-6">
              Enter your registered phone number.
            </p>

            <form onSubmit={handleSendOTP}>
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
                placeholder="Enter phone number"
                className="w-full border rounded-lg px-4 py-3 mb-4"
              />

              {error && (
                <p className="text-red-500 text-sm mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-lg py-3"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 2 — OTP */}
        {otpSent && !verified && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Verify OTP
            </h1>

            <p className="text-gray-500 mb-6">
              Enter the 6-digit OTP sent to +91 {phone}
            </p>

            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                placeholder="Enter OTP"
                className="w-full border rounded-lg px-4 py-3 mb-4"
              />

              {error && (
                <p className="text-red-500 text-sm mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-lg py-3"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {verified && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Reset Password
            </h1>

            <p className="text-gray-500 mb-6">
              Enter your new password.
            </p>

            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full border rounded-lg px-4 py-3 mb-4"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border rounded-lg px-4 py-3 mb-4"
              />

              {error && (
                <p className="text-red-500 text-sm mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-lg py-3"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;

