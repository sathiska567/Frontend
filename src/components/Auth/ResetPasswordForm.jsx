import React, { useState } from "react";
import Card from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import authService from "../../services/authService";

const ResetPasswordForm = ({ switchView, onClose }) => {
  const [requestData, setRequestData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Handle request form changes
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate request form
  const validateRequest = () => {
    const newErrors = {};

    if (!requestData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(requestData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle request form submission
  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    if (validateRequest()) {
      setIsLoading(true);

      try {
        // Call forgot-password API using authService
        await authService.requestPasswordReset(requestData.email);

        // Store email securely for the next step
        sessionStorage.setItem("resetEmail", requestData.email);

        setIsLoading(false);
        setRequestSent(true);
      } catch (error) {
        setIsLoading(false);

        // Display specific error from API if available
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrors({
            email: error.response.data.message,
          });
        } else {
          setErrors({
            email: "Failed to send verification code. Please try again.",
          });
        }
      }
    }
  };

  // Navigate to OTP verification page
  const goToOTPVerification = () => {
    switchView("otp-verification");
  };

  // Handle request another reset
  const handleRequestAnother = () => {
    setRequestData({ email: "" });
    setRequestSent(false);
  };

  return (
    <Card
      shadow="xl"
      padding="lg"
      rounded="xl"
      className="border border-indigo-200/20 backdrop-blur-sm bg-white/90"
    >
      <div className="flex justify-between items-center">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Forgot Password?
          </h2>
          <p className="text-gray-600">
            Enter your email and we'll send you a verification code
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 h-8"
        >
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

      {/* Request Password Reset Form */}
      {!requestSent ? (
        <>
          <form onSubmit={handleRequestSubmit}>
            <Input
              type="email"
              label="Email address"
              name="email"
              value={requestData.email}
              onChange={handleRequestChange}
              placeholder="name@example.com"
              error={errors.email}
              required
              icon={
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mb-6"
              isLoading={isLoading}
            >
              Send Verification Code
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => switchView("login")}
              className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              ← Back to Login
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to{" "}
            <span className="font-medium">{requestData.email}</span>
          </p>
          <p className="text-gray-600 text-sm mb-6">
            The code will expire in 10 minutes. If you don't see the email,
            check your spam folder.
          </p>
          <div className="flex flex-col space-y-4">
            <Button variant="outline" size="md" onClick={handleRequestAnother}>
              Request Another Code
            </Button>
            <Button variant="primary" size="md" onClick={goToOTPVerification}>
              Enter Verification Code
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResetPasswordForm;
