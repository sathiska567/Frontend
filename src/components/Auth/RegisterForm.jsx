import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  clearRegistrationSuccess,
} from "../../store/slices/authSlice";
import Card from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

const RegisterForm = ({ switchView, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading, error, registrationSuccess } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase and numbers";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      dispatch(
        register({
          f_name: formData.firstName.trim(),
          l_name: formData.lastName.trim(),
          email: formData.email,
          password: formData.password,
          credits: 0,
          count: 0,
        })
      );
    }
  };

  // Handle redirect to login after registration
  const handleContinue = () => {
    dispatch(clearRegistrationSuccess());
    switchView("login");
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
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

  return (
    <Card
      shadow="xl"
      padding="lg"
      rounded="xl"
      className="border border-indigo-200/20 backdrop-blur-sm bg-white/90"
    >
      {!registrationSuccess ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Create an account
              </h2>
              <p className="text-gray-600">
                Fill in your details to get started
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                label="First Name (Optional)"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                }
              />

              <Input
                type="text"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                }
              />
            </div>

            <Input
              type="email"
              label="Email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
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

            <div className="mb-4">
              <Input
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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

              {formData.password && (
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
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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

            <div className="mb-6">
              <label className="flex items-start relative">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="sr-only" // Hide the original checkbox but keep it accessible
                />
                <div
                  className={`w-5 h-5 mt-0.5 border rounded flex items-center justify-center flex-shrink-0 ${
                    formData.agreeTerms
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {formData.agreeTerms && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="ml-7 mt-1 text-sm text-red-600">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mb-6"
              isLoading={isLoading}
            >
              Create account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                </svg>
                Facebook
              </Button>
            </div>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchView("login")}
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </button>
            </p>
          </form>
        </>
      ) : (
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
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. We've sent a
            verification email to{" "}
            <span className="font-medium">{formData.email}</span>.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleContinue}
          >
            Continue to Login
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RegisterForm;
