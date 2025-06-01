import React, { useState, useEffect } from "react";
import {
  Twitter,
  Github,
  Linkedin,
  ArrowRight,
  Code,
  Mail,
  X,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailError, setEmailError] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset the submission state when closing the modal
    if (isSubmitted) {
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
        setEmailError("");
      }, 300);
    }
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear error when user starts typing again
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email before submission
    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // If validation passes, proceed with form submission
    setEmailError("");
    setIsSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show back to top button when page is scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentYear = new Date().getFullYear();

  // Footer links organized by categories
  const linkCategories = [
    {
      title: "Product",
      links: [
        { name: "Features", path: "/features" },
        { name: "Pricing", path: "/pricing" },
        { name: "API", path: "/api" },
        { name: "Documentation", path: "/docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "GDPR", path: "/gdpr" },
      ],
    },
  ];

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 cursor-pointer right-6 bg-[#E60076] hover:bg-[#C23B79] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <footer className="bg-[#1A1A2E] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#3F3F5F]">
            {/* Company info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold">
                  TagzAi<span className="text-[#E60076]">.</span>
                </h2>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Enterprise-grade image recognition and tagging API for
                developers and businesses. Reliable, scalable, and secure.
              </p>

              {/* Newsletter signup button */}
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-300">
                Stay updated
              </h3>
              <button
                onClick={openModal}
                className="bg-[#2D2D42] hover:bg-[#3F3F5F] border border-[#3F3F5F] text-white py-2 px-4 rounded-md transition-colors text-sm flex items-center whitespace-nowrap font-medium"
              >
                <Mail size={16} className="mr-2" />
                Subscribe to our newsletter
              </button>
            </div>

            {/* Links sections */}
            {linkCategories.map((category, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.path}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* API Banner */}
          {/* <div className="mt-12 bg-[#2D2D42] rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h3 className="font-medium text-lg mb-2">
                Get started with our API
              </h3>
              <p className="text-gray-400">
                Deploy in minutes with 100 free API calls per month. No credit
                card required.
              </p>
            </div>
            <a
              href="/api/docs"
              className="mt-4 sm:mt-0 px-5 py-3 bg-[#E60076] hover:bg-[#C23B79] rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap"
            >
              <Code size={18} className="mr-2" />
              Get API Key
            </a>
          </div> */}

          {/* Copyright and social icons in the same row at bottom */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center pt-6">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <span>© {currentYear} Pearl360°, All rights reserved.</span>
            </div>

            {/* Social icons */}
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/keygen"
                className="p-2 bg-[#2D2D42] hover:bg-[#3F3F5F] rounded-md transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://github.com/keygen"
                className="p-2 bg-[#2D2D42] hover:bg-[#3F3F5F] rounded-md transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/company/keygen"
                className="p-2 bg-[#2D2D42] hover:bg-[#3F3F5F] rounded-md transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:hello@keygen.ai"
                className="p-2 bg-[#2D2D42] hover:bg-[#3F3F5F] rounded-md transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Newsletter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-[#1A1A2E] rounded-lg max-w-md w-full p-6 relative animate-fade-in shadow-xl"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Subscribe to our newsletter
                </h3>
                <p className="text-gray-400 mb-6">
                  Stay up to date with the latest news, product updates, and
                  exclusive offers from KeyGen. We'll never spam your inbox.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com"
                      className={`px-4 py-2 bg-[#2D2D42] border rounded-md focus:outline-none focus:ring-1 w-full text-sm text-white ${
                        emailError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#3F3F5F] focus:ring-[#E60076]"
                      }`}
                      aria-invalid={emailError ? "true" : "false"}
                      aria-describedby={emailError ? "email-error" : undefined}
                    />
                    {emailError && (
                      <p id="email-error" className="mt-2 text-sm text-red-500">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#E60076] text-white py-2 px-4 rounded-md hover:bg-[#C23B79] transition-colors text-sm flex items-center justify-center font-medium"
                  >
                    Subscribe
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                  By subscribing, you agree to our{" "}
                  <a href="/privacy" className="text-[#E60076] hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms" className="text-[#E60076] hover:underline">
                    Terms of Service
                  </a>
                  .
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#E60076] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Thank you for subscribing!
                </h3>
                <p className="text-gray-400 mb-6">
                  You're now signed up to receive the latest news, product
                  updates, and exclusive offers from KeyGen.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-[#2D2D42] hover:bg-[#3F3F5F] text-white py-2 px-6 rounded-md transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
