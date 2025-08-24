import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plane } from "lucide-react";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [userRole, setUserRole] = useState<"sender" | "traveler">("sender");

  useEffect(() => {
    // Get user role from localStorage
    const savedRole = localStorage.getItem("airbar-user-role");
    if (savedRole === "sender" || savedRole === "traveler") {
      setUserRole(savedRole);
    }

    const handleScroll = () => {
      // Show after 80px scroll, hide when back at top
      const heroElement = document.getElementById("hero-section");
      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
        setIsVisible(window.scrollY > 80 && window.scrollY > heroBottom);
      } else {
        setIsVisible(window.scrollY > 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    // Listen for role changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "airbar-user-role" && e.newValue) {
        setUserRole(e.newValue as "sender" | "traveler");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const content = {
    sender: {
      icon: Send,
      text: "Send a Package",
      link: "/send-package",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    traveler: {
      icon: Plane,
      text: "Earn While Traveling",
      link: "/dashboard/traveler/trips/addtrip",
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
  };

  const primaryContent = content[userRole];
  const secondaryContent =
    content[userRole === "sender" ? "traveler" : "sender"];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200"
        >
          <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                {userRole === "sender"
                  ? "Save up to 70% on international shipping"
                  : "Earn money on your next trip"}
              </p>

              <div className="flex gap-3">
                {/* Primary CTA */}
                <a
                  href={primaryContent.link}
                  className={`flex items-center gap-2 rounded-lg ${primaryContent.bgColor} px-6 py-3 text-sm font-medium text-white transition-all ${primaryContent.hoverColor} hover:scale-105 shadow-md`}
                >
                  <primaryContent.icon size={18} />
                  {primaryContent.text}
                </a>

                {/* Secondary CTA */}
                <a
                  href={secondaryContent.link}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105"
                >
                  <secondaryContent.icon size={18} />
                  {secondaryContent.text}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
