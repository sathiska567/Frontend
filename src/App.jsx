// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./store/slices/userSlice";
import { checkAuth, setSessionExpired } from "./store/slices/authSlice";

import NavBarSection from "./components/homepageComponents/NavBarSection/NavBar";
import HomePage from "./components/HomePage/HomePage";
import UserProfilePage from "./components/UserProfilePage/UserProfilePage";
import Footer from "./components/homepageComponents/Footer/Footer";
import ResultPage from "./components/ResultPageComponents/ResultPage";
import AlbumsPage from "./components/AlbumsPage/AlbumsPage";
import AlbumDetailsPage from "./components/AlbumsPage/AlbumDetailsPage";
import ImageDetailsPage from "./components/AlbumsPage/ImageDetailsPage";
import FAQPage from "./components/homepageComponents/FAQSection/FAQSection";
import PricingPage from "./components/homepageComponents/PricingSection/PricingSection";
import TrendsPage from "./components/TrendsPage/TrendsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthModal from "./components/Auth/AuthModal";
import UploadPage from "./components/uploadPageComponents/ModernUploadPage";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import UserPayment from "./components/PaymentPage/UserPayment";

const stripePromise = loadStripe(
  "pk_test_51PH8bkRqmdDNCbTMCPkDJB0E5dNlOffSSZO3VZu8jCSrAR90a9iiqstxWMi7YJcwSVWT4Y5NDAOLcqZ0yptvL8dD00ogSGb4HL"
);

function AppContent() {
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const { isLoggedIn, sessionExpired } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);
  const { isModalOpen, modalView, closeAuth, openAuth } = useAuth();

  // Verify authentication on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Intercept auth routes and show modal instead
  useEffect(() => {
    if (path === "/login") {
      openAuth("login");
      window.history.replaceState(null, "", "/");
    } else if (path === "/register") {
      openAuth("register");
      window.history.replaceState(null, "", "/");
    } else if (path === "/reset-password") {
      openAuth("reset-password");
      window.history.replaceState(null, "", "/");
    } else if (path === "/otp-verification") {
      openAuth("otp-verification");
      window.history.replaceState(null, "", "/");
    } else if (path === "/new-password") {
      openAuth("new-password");
      window.history.replaceState(null, "", "/");
    } else if (path === "/email-verification") {
      openAuth("email-verification");
      window.history.replaceState(null, "", "/");
    }
  }, [path, openAuth]);

  // Handle token expiration notification
  useEffect(() => {
    if (sessionExpired) {
      openAuth("login");
    }
  }, [sessionExpired, openAuth]);

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
  }, [dispatch, openAuth]);

  // Fetch user profile when logged in and profile not available
  useEffect(() => {
    if (isLoggedIn && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [isLoggedIn, profile, dispatch]);

  // Handle URL hash for token (for OAuth redirects)
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Check if there's a token in the URL (from OAuth redirect)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        try {
          // Parse access token and refresh token from URL
          const tokens = hash
            .substring(1)
            .split("&")
            .reduce((acc, item) => {
              const [key, value] = item.split("=");
              acc[key] = value;
              return acc;
            }, {});

          if (tokens.access_token) {
            // Store tokens
            localStorage.setItem("access_token", tokens.access_token);
            if (tokens.refresh_token) {
              document.cookie = `refresh_token=${tokens.refresh_token
                }; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
            }

            // Store user email if present
            if (tokens.email) {
              localStorage.setItem(
                "user_email",
                decodeURIComponent(tokens.email)
              );
            }

            // Store token creation time
            localStorage.setItem("token_created_at", Date.now().toString());

            // Set logged in status in Redux
            await dispatch(checkAuth());

            // Clear the hash from URL
            window.location.hash = "";
          }
        } catch (error) {
          console.error("Failed to process OAuth redirect:", error);
        }
      }
    };

    handleOAuthRedirect();
  }, [dispatch]);

  // Paths without footer
  const noFooterPaths = ["/result", "/upload"];
  const shouldHideFooter = noFooterPaths.some((p) => path.startsWith(p));

  // Album and image detail pages don't need footer either
  const isAlbumOrImagePath =
    path.startsWith("/albums/") || path.startsWith("/images/");
  const hideFooter = shouldHideFooter || isAlbumOrImagePath;

  return (
    <>
      {/* Navbar */}
      <NavBarSection />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={closeAuth}
        initialView={modalView}
      />

      {/* Main content */}
      <div className="flex-grow">
        <Routes>
          {/* Protected routes */}
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />

          {/* Result route */}
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          {/* Album routes */}
          <Route
            path="/albums"
            element={
              <ProtectedRoute>
                <AlbumsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/albums/:albumId"
            element={
              <ProtectedRoute>
                <AlbumDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images/:imageId"
            element={
              <ProtectedRoute>
                <ImageDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/trends" element={<TrendsPage />} />

          {/* Payment Page */}
          <Route path="/payment" element={<UserPayment/>} />

          {/* 404 Not Found */}
          <Route path="/404" element={<h1>404 Not Found</h1>} />

          {/* Redirect all other paths to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <AppContent />
          </div>
        </Elements>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
