import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../firebase";

export const sendPasswordResetOTP = async (phoneNumber) => {
    try {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                }
            );
        }

        const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;

        return {
            success: true,
            message: "OTP sent successfully",
        };
    } catch (error) {
        console.error("OTP ERROR:", error);

        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }

        throw error;
    }
};

export const verifyPasswordResetOTP = async (otp) => {
    try {
        if (!window.confirmationResult) {
            throw new Error("OTP session expired. Please request a new OTP.");
        }

        const result = await window.confirmationResult.confirm(otp);
        window.passwordResetUser = result.user;
        return {
            success: true,
            user: result.user,
        };
    } catch (error) {
        console.error("OTP VERIFICATION ERROR:", error);
        throw error;
    }
};