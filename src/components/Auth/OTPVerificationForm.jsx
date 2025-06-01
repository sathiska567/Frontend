import React, { useState, useEffect } from "react";
import Card from "../../ui/card";
import { Button } from "../../ui/button";
import authService from "../../services/authService";

const OTPVerificationForm = ({ switchView, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  // References for OTP inputs
  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef());

  // Get email from session storage
  useEffect(() => {
    const resetEmail = sessionStorage.getItem("resetEmail");
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      // If no email found, go back to reset-password
      switchView("reset-password");
    }
  }, [switchView]);

  // Timer for OTP resend countdown
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear any previous errors
    if (error) setError("");

    // Auto move to next input if current one is filled
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle key press for backspace to move focus backwards
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP paste (e.g., from SMS)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted content contains only digits
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 6);

    // Fill in as many inputs as we have digits
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one if all filled
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex === -1) {
      inputRefs[5].current.focus();
    } else {
      inputRefs[nextEmptyIndex].current.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;

    setIsResending(true);

    try {
      // Call the API to resend OTP
      await authService.requestPasswordReset(email);

      setTimeLeft(60);
      setIsResending(false);
      setError("");
      // Clear OTP fields
      setOtp(["", "", "", "", "", ""]);
      // Focus the first input
      inputRefs[0].current.focus();
    } catch (error) {
      setIsResending(false);
      setError("Failed to resend code. Please try again.");
    }
  };

  // Submit OTP for verification and move to password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if OTP is complete
    if (otp.some((digit) => digit === "")) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    const otpString = otp.join("");

    try {
      // Verify OTP with the server
      await authService.verifyPasswordOtp(email, otpString);

      // Store the verified OTP for next step
      sessionStorage.setItem("resetOTP", otpString);

      // Navigate to new password page
      setIsVerifying(false);
      switchView("new-password");
    } catch (error) {
      setIsVerifying(false);

      // Display specific error from API if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Invalid or expired verification code");
      }
    }
  };

  return (
    <Card
      shadow="xl"
      padding="lg"
      rounded="xl"
      className="border border-indigo-200/20 backdrop-blur-sm bg-white/90"
    >
      <div className="flex justify-between items-start">
        <div className="text-center mb-6 flex-grow">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Verification Code
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP Input fields */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              className={`
                w-12 h-14 text-center text-xl font-bold rounded-lg border-2 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                ${error ? "border-red-500" : "border-gray-300"}
                bg-white/80 backdrop-blur-sm
              `}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        {/* Verify button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mb-6"
          isLoading={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify & Continue"}
        </Button>

        {/* Resend option */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>

          {timeLeft > 0 ? (
            <p className="text-gray-500 text-sm">
              Resend in <span className="font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className={`
                text-indigo-600 hover:text-indigo-800 font-medium text-sm
                ${isResending ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => switchView("reset-password")}
          className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          ← Back to Reset Password
        </button>
      </div>
    </Card>
  );
};

export default OTPVerificationForm;
