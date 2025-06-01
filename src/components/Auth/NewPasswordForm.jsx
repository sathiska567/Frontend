import React, { useState, useEffect } from "react";
import Card from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import authService from "../../services/authService";

const NewPasswordForm = ({ switchView, onClose }) => {
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  // Get email and OTP from sessionStorage
  useEffect(() => {
    const resetEmail = sessionStorage.getItem("resetEmail");
    const resetOTP = sessionStorage.getItem("resetOTP");

    if (!resetEmail || !resetOTP) {
      // If required data is missing, go back to reset-password
      switchView("reset-password");
      return;
    }

    setEmail(resetEmail);
    setOtpCode(resetOTP);
  }, [switchView]);

  const getPasswordStrength = () => {
    const { password } = resetData;
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      1: { label: "Weak", color: "bg-red-500" },
      2: { label: "Fair", color: "bg-orange-500" },
      3: { label: "Good", color: "bg-yellow-500" },
      4: { label: "Strong", color: "bg-green-500" },
      5: { label: "Very Strong", color: "bg-green-600" },
    };

    return {
      strength,
      ...strengthMap[strength],
    };
  };

  const passwordStrength = getPasswordStrength();

  // Handle reset form changes
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
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

  // Validate reset form
  const validateReset = () => {
    const newErrors = {};

    if (!resetData.password) {
      newErrors.password = "Password is required";
    } else if (resetData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(resetData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase and numbers";
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (resetData.confirmPassword !== resetData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle reset form submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (validateReset()) {
      setIsLoading(true);

      try {
        // Call the reset-password API
        await authService.resetPassword(email, otpCode, resetData.password);

        // Clear stored data after successful reset
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetOTP");

        setIsLoading(false);
        setResetComplete(true);
      } catch (error) {
        setIsLoading(false);

        // Display specific error from API if available
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrors({
            password: error.response.data.message,
          });
        } else {
          setErrors({
            password: "Failed to reset password. Please try again.",
          });
        }
      }
    }
  };

  // Go to login form
  const goToLogin = () => {
    switchView("login");
  };

  return (
    <Card
      shadow="xl"
      padding="lg"
      rounded="xl"
      className="border border-indigo-200/20 backdrop-blur-sm bg-white/90"
    >
      <div className="flex justify-between items-start">
        {!resetComplete ? (
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Set New Password
            </h2>
            <p className="text-gray-600">
              Create a strong password for your account
            </p>
          </div>
        ) : (
          <div className="flex-grow"></div>
        )}
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

      {!resetComplete ? (
        <form onSubmit={handleResetSubmit}>
          <div className="mb-4">
            <Input
              type="password"
              label="New Password"
              name="password"
              value={resetData.password}
              onChange={handleResetChange}
              placeholder="••••••••"
              error={errors.password}
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              }
            />

            {resetData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-gray-600">
                    Password strength:
                  </div>
                  <div className="text-xs font-medium">
                    {passwordStrength.label}
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color}`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <Input
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            value={resetData.confirmPassword}
            onChange={handleResetChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
            Reset Password
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => switchView("otp-verification")}
              className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              ← Back to Verification
            </button>
          </div>
        </form>
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
            Password Reset Complete
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={goToLogin}
          >
            Return to Login
          </Button>
        </div>
      )}
    </Card>
  );
};

export default NewPasswordForm;
