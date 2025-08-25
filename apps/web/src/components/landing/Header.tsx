import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { RoleToggle } from "./RoleToggle";

interface HeaderProps {
  role: "sender" | "traveler";
  onRoleChange: (role: "sender" | "traveler") => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onRoleChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded">
                Airbar
              </div>
            </div>
          </div>

          {/* Center - Role Toggle (Desktop) */}
          <div className="hidden md:flex items-center">
            <RoleToggle value={role} onChange={onRoleChange} />
          </div>

          {/* Right - CTAs */}
          <div className="flex items-center space-x-4">
            <button
              className="hidden sm:inline-flex text-gray-600 hover:text-gray-900 text-sm font-medium"
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              How it works
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "click_cta_primary", {
                    role,
                    location: "header",
                  });
                }
                // Navigate based on role
                if (role === "sender") {
                  navigate("/send-package");
                } else {
                  navigate("/add-trip");
                }
              }}
            >
              {role === "sender" ? "Start Shipping" : "Post Your Trip"}
            </button>
          </div>
        </div>

        {/* Mobile Role Toggle */}
        <div className="md:hidden pb-4">
          <RoleToggle value={role} onChange={onRoleChange} />
        </div>
      </div>
    </header>
  );
};
