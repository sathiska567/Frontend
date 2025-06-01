import React, { createContext, useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAuthState,
  checkAuth,
  setSessionExpired,
  refreshToken,
} from "../../store/slices/authSlice";
import authService from "../../services/authService";

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login");
  const { isLoggedIn, sessionExpired } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Check authentication status on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Listen for session expired events
  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(setSessionExpired(true));
      openAuth("login");
    };

    window.addEventListener("auth:sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:sessionExpired", handleSessionExpired);
    };
  }, [dispatch]);

  // Handle session expiration
  useEffect(() => {
    if (sessionExpired) {
      openAuth("login");
    }
  }, [sessionExpired]);

  // Set up token refresh interval
  useEffect(() => {
    let refreshInterval;

    if (isLoggedIn) {
      // Check token every minute
      refreshInterval = setInterval(async () => {
        try {
          if (authService.isTokenExpired()) {
            await dispatch(refreshToken()).unwrap();
          }
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // Session expired handling happens in the API interceptor
        }
      }, 60000); // Check every minute
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isLoggedIn, dispatch]);

  // Close modal when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setIsModalOpen(false);
    }
  }, [isLoggedIn]);

  // Reset auth state when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      dispatch(resetAuthState());
    }
  }, [isModalOpen, dispatch]);

  // Open modal with specific view
  const openAuth = (view = "login") => {
    setModalView(view);
    setIsModalOpen(true);
  };

  // Close modal
  const closeAuth = () => {
    setIsModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isModalOpen,
        modalView,
        openAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
