import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";
import OTPVerificationForm from "./OTPVerificationForm";
import NewPasswordForm from "./NewPasswordForm";
import EmailVerificationForm from "./EmailVerificationForm";

const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const navigate = useNavigate();

  useEffect(() => {
    // Update current view when initialView prop changes
    setCurrentView(initialView);
  }, [initialView]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginForm switchView={setCurrentView} onClose={onClose} />;
      case "register":
        return <RegisterForm switchView={setCurrentView} onClose={onClose} />;
      case "reset-password":
        return (
          <ResetPasswordForm switchView={setCurrentView} onClose={onClose} />
        );
      case "otp-verification":
        return (
          <OTPVerificationForm switchView={setCurrentView} onClose={onClose} />
        );
      case "new-password":
        return (
          <NewPasswordForm switchView={setCurrentView} onClose={onClose} />
        );
      case "email-verification":
        return (
          <EmailVerificationForm
            switchView={setCurrentView}
            onClose={onClose}
          />
        );
      default:
        return <LoginForm switchView={setCurrentView} onClose={onClose} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md">{renderView()}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
