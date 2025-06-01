// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "./Auth/AuthContext";
import { checkAuth } from "../store/slices/authSlice";
import authService from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);
  const { openAuth } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if token is valid or can be refreshed
        const isValid = await authService.isAuthenticated();
        setIsAuthenticated(isValid);

        if (!isValid) {
          // Dispatch check auth to update Redux state
          dispatch(checkAuth());
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuth("login");
    }
  }, [openAuth, isAuthenticated]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to home
  if (!isAuthenticated) {
    // Redirect to home page but remember where they were trying to go
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
