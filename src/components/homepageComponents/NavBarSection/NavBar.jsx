/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  Upload,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Diamond,
} from "lucide-react";
import { logout } from "../../../store/slices/authSlice";
import {
  clearUserProfile,
  fetchUserProfile,
} from "../../../store/slices/userSlice";
import { resetAlbumData } from "../../../store/slices/albumSlice";
import { useAuth } from "../../Auth/AuthContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [lastCreditsCheck, setLastCreditsCheck] = useState(0);

  const profileDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openAuth } = useAuth();

  // Get auth and user state from Redux
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { profile, lastFetched } = useSelector((state) => state.user);

  // Refresh user profile when logged in or when lastFetched changes
  useEffect(() => {
    if (isLoggedIn) {
      // Fetch user profile immediately when logged in
      dispatch(fetchUserProfile());
    }
  }, [isLoggedIn, dispatch]);

  // Set up a polling mechanism to periodically refresh the profile
  useEffect(() => {
    let intervalId;

    if (isLoggedIn) {
      // Check for profile updates every 15 seconds
      intervalId = setInterval(() => {
        const now = Date.now();
        // Only fetch if it's been more than 10 seconds since the last fetch
        if (now - lastCreditsCheck > 10000) {
          dispatch(fetchUserProfile());
          setLastCreditsCheck(now);
        }
      }, 15000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn, dispatch, lastCreditsCheck]);

  // Refresh profile whenever the lastFetched timestamp changes
  useEffect(() => {
    if (lastFetched) {
      setLastCreditsCheck(Date.now());
    }
  }, [lastFetched]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicks outside of profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle login button click
  const handleLoginClick = () => {
    openAuth("login");

    // Create a polling mechanism to check for login and fetch profile
    const checkLoginStatus = setInterval(() => {
      if (isLoggedIn) {
        dispatch(fetchUserProfile());
        clearInterval(checkLoginStatus);
      }
    }, 500); // Check every 500ms

    // Clear interval after 10 seconds to prevent endless polling
    setTimeout(() => clearInterval(checkLoginStatus), 10000);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserProfile());
    dispatch(resetAlbumData());
    setProfileDropdownOpen(false);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Handle image upload and tag generation
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      setUploadedImage(imageUrl);

      // Simulate tag generation with a loading state
      setTags([]);
      setTimeout(() => {
        const generatedTags = [
          "AI",
          "Machine Learning",
          "Computer Vision",
          "Neural Network",
          "Deep Learning",
        ];
        setTags(generatedTags);

        // Refresh the user profile to get updated credits after tag generation
        dispatch(fetchUserProfile());
      }, 1500);
    }
  };

  // Get first letter for avatar
  const getAvatarContent = () => {
    if (!isLoggedIn) {
      return <User size={16} className="text-white" />;
    }

    if (profile && profile.f_name) {
      return profile.f_name.charAt(0).toUpperCase();
    }

    if (profile && profile.email) {
      return profile.email.charAt(0).toUpperCase();
    }

    return <User size={16} className="text-white" />;
  };

  // Get display name for profile
  const getDisplayName = () => {
    if (!isLoggedIn) return "Profile";

    if (profile && profile.f_name) {
      return profile.f_name;
    }

    return "Profile";
  };

  // Get credits count
  const getCreditsCount = () => {
    if (profile && profile.credits !== undefined) {
      return profile.credits;
    }
    return 0;
  };

  // Force refresh profile data
  const forceRefreshProfile = () => {
    if (isLoggedIn) {
      dispatch(fetchUserProfile());
    }
  };

  // Navigation links
  const navLinks = [
    {
      name: "Upload",
      path: "/upload",
      icon: <Upload size={16} />,
      isUpload: true,
    },
    { name: "Pricing", path: "/pricing", icon: null },
    { name: "FAQ", path: "/faq", icon: null },
    // { name: "API", path: "/api", icon: null, hasDropdown: true },
    { name: "Albums", path: "/albums", icon: null },
  ];

  return (
    <div className="sticky top-0 z-50">
      <nav
        className={`${
          scrolled
            ? "bg-white text-gray-800 shadow-lg"
            : "bg-transparent text-white"
        } transition-all duration-300`}
      >
        {/* Background gradient overlay when not scrolled - UPDATED TO INDIGO/PURPLE THEME */}
        {!scrolled && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/95 via-purple-500/90 to-indigo-500/95 backdrop-blur-sm z-0"></div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand - left side - UPDATED COLORS */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <a href="/">
                  <h1
                    className={`text-xl font-bold ${
                      scrolled
                        ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
                        : "text-white"
                    } tracking-tight`}
                  >
                    TagzAi
                    <span
                      className={scrolled ? "text-purple-600" : "text-white"}
                    >
                      .
                    </span>
                  </h1>
                </a>
              </div>
            </div>

            {/* Navigation for desktop - right side */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.isUpload ? (
                    <Link
                      to={link.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer group relative overflow-hidden"
                    >
                      <span
                        className={`absolute inset-0 ${
                          scrolled ? "bg-indigo-50" : "bg-indigo-500/20"
                        } transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`}
                      ></span>
                      <Upload size={16} className="mr-2 relative z-10" />
                      <span className="relative z-10">Upload</span>
                    </Link>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium relative overflow-hidden group`}
                    >
                      <span
                        className={`absolute inset-0 ${
                          scrolled ? "bg-indigo-100" : "bg-white/10"
                        } transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`}
                      ></span>
                      {link.icon && (
                        <span className="mr-2 relative z-10">{link.icon}</span>
                      )}
                      <span className="relative z-10">{link.name}</span>
                      {link.hasDropdown && (
                        <ChevronDown
                          size={14}
                          className="ml-1 relative z-10 group-hover:rotate-180 transition-transform duration-300"
                        />
                      )}
                    </Link>
                  )}

                  {/* Dropdown for API if needed - UPDATED COLORS */}
                  {link.hasDropdown && (
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 origin-top-left">
                      <a
                        href="/api/docs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                      >
                        Documentation
                      </a>
                      <a
                        href="/api/keys"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                      >
                        API Keys
                      </a>
                      <a
                        href="/api/playground"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                      >
                        Playground
                      </a>
                    </div>
                  )}
                </div>
              ))}

              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {isLoggedIn && (
                <>
                  {/* Credits Display - UPDATED COLORS */}
                  <div
                    className={`px-3 py-1.5 rounded-full ${
                      scrolled
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-indigo-500/20 text-white"
                    } transition-colors duration-200 flex items-center gap-1.5 ml-2 cursor-pointer hover:bg-opacity-80`}
                    onClick={forceRefreshProfile}
                    title="Click to refresh credits"
                  >
                    <Diamond size={16} className="fill-current opacity-90" />
                    <span className="text-xs font-medium">
                      {getCreditsCount()}
                    </span>
                  </div>
                </>
              )}

              {/* Profile/Login Section */}
              {isLoggedIn ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ml-2 relative group overflow-hidden`}
                  >
                    <span
                      className={`absolute inset-0 ${
                        scrolled ? "bg-indigo-100" : "bg-white/10"
                      } transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`}
                    ></span>
                    {/* User avatar - UPDATED TO INDIGO/PURPLE GRADIENT */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm relative z-10">
                      {getAvatarContent()}
                    </div>
                    <span className="relative z-10">{getDisplayName()}</span>
                    <ChevronDown
                      size={14}
                      className={`ml-1 relative z-10 transition-transform duration-300 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown - UPDATED COLORS */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={14} className="inline mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                      >
                        <LogOut size={14} className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scrolled
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm"
                      : "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 hover:from-indigo-500/40 hover:to-purple-500/40 backdrop-blur-sm text-white"
                  } transition-all duration-300 flex items-center gap-2 ml-2 relative overflow-hidden group transform hover:scale-105`}
                >
                  <span className="absolute inset-0 bg-white/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  <LogIn size={16} className="relative z-10" />
                  <span className="relative z-10">Login</span>
                </button>
              )}
            </div>

            {/* Mobile menu button - right aligned */}
            <div className="lg:hidden flex items-center ml-auto">
              {isLoggedIn && (
                <>
                  {/* Mobile Credits Display - UPDATED COLORS */}
                  <div
                    className={`px-2 py-1 rounded-full ${
                      scrolled
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-indigo-500/20 text-white"
                    } transition-colors duration-200 flex items-center gap-1 mr-2 cursor-pointer hover:bg-opacity-80`}
                    onClick={forceRefreshProfile}
                    title="Click to refresh credits"
                  >
                    <Diamond size={14} className="fill-current opacity-90" />
                    <span className="text-xs font-medium">
                      {getCreditsCount()}
                    </span>
                  </div>
                </>
              )}

              {!isLoggedIn && (
                <button
                  onClick={handleLoginClick}
                  className={`p-2 rounded-md mr-2 ${
                    scrolled
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white"
                  } transition-colors duration-200`}
                >
                  <LogIn size={20} />
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md ${
                  scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                } transition-colors duration-200`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <input
                id="mobile-image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        {/* Mobile menu - UPDATED BACKGROUND COLORS */}
        {isOpen && (
          <div
            className={`lg:hidden ${
              scrolled
                ? "bg-white text-gray-800"
                : "bg-gradient-to-r from-indigo-600/95 via-purple-600/95 to-indigo-600/95 backdrop-blur-sm text-white"
            } absolute w-full z-50 shadow-lg transition-all duration-300`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.isUpload ? (
                    <Link
                      to={link.path}
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700/50 flex items-center gap-2 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-indigo-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                      <Upload size={16} className="relative z-10" />
                      <span className="relative z-10">Upload</span>
                    </Link>
                  ) : (
                    <Link
                      to={link.path}
                      className="block px-3 py-2 rounded-md text-base font-medium flex items-center relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-indigo-600/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                      {link.icon && (
                        <span className="mr-2 relative z-10">{link.icon}</span>
                      )}
                      <span className="relative z-10">{link.name}</span>
                      {link.hasDropdown && (
                        <ChevronDown
                          size={14}
                          className="ml-2 relative z-10 group-hover:rotate-180 transition-transform duration-300"
                        />
                      )}
                    </Link>
                  )}

                  {/* Dropdown items for mobile - UPDATED BORDER COLOR */}
                  {link.hasDropdown && (
                    <div className="pl-6 mt-1 border-l-2 border-indigo-500 ml-4">
                      <a
                        href="/api/docs"
                        className="block px-3 py-2 text-sm opacity-80 hover:opacity-100"
                      >
                        Documentation
                      </a>
                      <a
                        href="/api/keys"
                        className="block px-3 py-2 text-sm opacity-80 hover:opacity-100"
                      >
                        API Keys
                      </a>
                      <a
                        href="/api/playground"
                        className="block px-3 py-2 text-sm opacity-80 hover:opacity-100"
                      >
                        Playground
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {isLoggedIn && (
                <div className="pt-4 pb-3 border-t border-indigo-500/40">
                  <div className="flex items-center px-3 py-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={forceRefreshProfile}
                    >
                      <Diamond
                        size={16}
                        className="text-indigo-400 fill-current opacity-90"
                      />
                      <span className="text-sm font-medium">
                        {getCreditsCount()} Credits
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/user-profile"
                    className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-indigo-600/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm relative z-10">
                      {getAvatarContent()}
                    </div>
                    <span className="relative z-10">{getDisplayName()}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-indigo-600/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    <LogOut size={16} className="relative z-10" />
                    <span className="relative z-10">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Tag display area if image is uploaded - UPDATED COLORS */}
      {uploadedImage && (
        <div
          className={`${
            scrolled
              ? "bg-indigo-50"
              : "bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-indigo-600/90 backdrop-blur-sm"
          } py-3 px-4 transition-all duration-300 border-t ${
            scrolled ? "border-indigo-100" : "border-indigo-500"
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md overflow-hidden border-2 border-indigo-500 shadow-lg mr-3">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {tags.length > 0 ? "Generated Tags:" : "Analyzing image..."}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`${
                      scrolled
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-500/70 text-white"
                    } px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-md`}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <div className="flex space-x-2 items-center">
                  <div className="animate-pulse flex space-x-2">
                    <div
                      className={`${
                        scrolled ? "bg-indigo-200" : "bg-indigo-500/60"
                      } h-5 w-16 rounded-full`}
                    ></div>
                    <div
                      className={`${
                        scrolled ? "bg-indigo-200" : "bg-indigo-500/60"
                      } h-5 w-24 rounded-full`}
                    ></div>
                    <div
                      className={`${
                        scrolled ? "bg-indigo-200" : "bg-indigo-500/60"
                      } h-5 w-20 rounded-full`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// This custom hook can be used in other components to trigger profile refresh
// eslint-disable-next-line react-refresh/only-export-components
export const useProfileRefresh = () => {
  const dispatch = useDispatch();

  return {
    refreshProfile: () => dispatch(fetchUserProfile()),
  };
};

export default NavBar;
