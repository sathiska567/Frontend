import React, { useState, useEffect } from "react";
import Card from "../../ui/card";
import { Button } from "../../ui/button";

const EmailVerificationForm = ({ switchView, onClose }) => {
  const [verificationState, setVerificationState] = useState("loading");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from session storage or use placeholder
    const storedEmail =
      sessionStorage.getItem("resetEmail") ||
      sessionStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Simulate verification process
    const simulateVerification = () => {
      const states = ["success", "expired", "error"];
      const randomState = states[Math.floor(Math.random() * states.length)];

      setTimeout(() => {
        setVerificationState(randomState);
      }, 2000);
    };

    simulateVerification();
  }, []);

  useEffect(() => {
    if (timeLeft === 0 || verificationState === "success") return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, verificationState]);

  // Resend verification email
  const handleResendEmail = () => {
    if (timeLeft > 0) return;

    setIsResending(true);

    setTimeout(() => {
      setTimeLeft(60);
      setIsResending(false);
      setVerificationState("loading");

      setTimeout(() => {
        const states = ["success", "expired", "error"];
        const randomState = states[Math.floor(Math.random() * states.length)];
        setVerificationState(randomState);
      }, 2000);
    }, 1500);
  };

  const goToDashboard = () => {
    onClose();
    // Navigate to dashboard or appropriate page
    window.location.href = "/dashboard";
  };

  return (
    <Card
      shadow="xl"
      padding="lg"
      rounded="xl"
      className="border border-indigo-200/20 backdrop-blur-sm bg-white/90"
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow"></div>
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

      {/* Loading State */}
      {verificationState === "loading" && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Your Email
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      )}

      {/* Success State */}
      {verificationState === "success" && (
        <div className="text-center py-6">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email Verified
          </h2>
          <p className="text-gray-600 mb-6">
            Your email address <span className="font-medium">{email}</span> has
            been successfully verified.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={goToDashboard}
          >
            Continue to Dashboard
          </Button>
        </div>
      )}

      {/* Expired State */}
      {verificationState === "expired" && (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Link Expired
          </h2>
          <p className="text-gray-600 mb-6">
            The verification link has expired. Please request a new verification
            email.
          </p>

          {timeLeft > 0 ? (
            <p className="text-gray-500 text-sm mb-4">
              Resend in <span className="font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleResendEmail}
              isLoading={isResending}
            >
              Resend Verification Email
            </Button>
          )}
        </div>
      )}

      {/* Error State */}
      {verificationState === "error" && (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't verify your email address. The link may be invalid or
            already used.
          </p>

          {timeLeft > 0 ? (
            <p className="text-gray-500 text-sm mb-4">
              Resend in <span className="font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleResendEmail}
              isLoading={isResending}
            >
              Resend Verification Email
            </Button>
          )}
        </div>
      )}

      {/* Back to login link */}
      {verificationState !== "success" && (
        <div className="text-center mt-6">
          <button
            onClick={() => switchView("login")}
            className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            ← Back to Login
          </button>
        </div>
      )}
    </Card>
  );
};

export default EmailVerificationForm;
