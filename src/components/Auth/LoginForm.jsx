import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogin, login } from "../../store/slices/authSlice";
import Card from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const LoginForm = ({ switchView, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, sessionExpired } = useSelector(
    (state) => state.auth
  );

  // Check if we have a redirect target from ProtectedRoute
  useEffect(() => {
    if (location.state?.from) {
      // Store the redirect path to use after login
      sessionStorage.setItem("redirectAfterAuth", location.state.from);
    }
  }, [location]);

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await dispatch(
          login({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe,
          })
        ).unwrap();

        // Close the modal
        onClose();

        // Check if we need to redirect the user
        const redirectPath = sessionStorage.getItem("redirectAfterAuth");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterAuth");
          navigate(redirectPath);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const handleGoogleButtonClick = () => {
    dispatch(googleLogin());
  };

  return (
    <Card
      shadow="xl"
      padding="lg"
      rounded="xl"
      className="border border-indigo-200/20 backdrop-blur-sm bg-white/90"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back
          </h2>
          <p className="text-gray-600">
            {sessionExpired
              ? "Your session has expired. Please log in again."
              : "Please enter your details"}
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

      {sessionExpired && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          Your session has expired. Please log in again to continue.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center relative">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="sr-only" // Hide the original checkbox but keep it accessible
            />
            <div
              className={`w-5 h-5 border rounded flex items-center justify-center ${
                formData.rememberMe
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500"
                  : "bg-white border-gray-300"
              }`}
            >
              {formData.rememberMe && (
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
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => switchView("reset-password")}
            className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mb-4"
          isLoading={isLoading}
        >
          Sign in
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            className="flex items-center justify-center"
            onClick={handleGoogleButtonClick}
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
      </form>

      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => switchView("register")}
          className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          Sign up
        </button>
      </p>
    </Card>
  );
};

export default LoginForm;
