import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Package, Plane, CheckCircle } from "lucide-react";

const steps = {
  sender: [
    {
      icon: Search,
      title: "Find a Traveler",
      description: "Search for verified travelers heading to your destination",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Package,
      title: "Book & Pay",
      description: "Secure your package with escrow-protected payment",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Plane,
      title: "Track Delivery",
      description: "Monitor your package in real-time until delivery",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: CheckCircle,
      title: "Confirm Receipt",
      description: "Release payment once your package arrives safely",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ],
  traveler: [
    {
      icon: Plane,
      title: "Post Your Trip",
      description: "Share your travel plans and available space",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Search,
      title: "Get Matches",
      description: "Review package requests from verified senders",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Package,
      title: "Carry & Deliver",
      description: "Pick up packages and deliver them safely",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: CheckCircle,
      title: "Earn Money",
      description: "Get paid instantly after successful delivery",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ],
};

export default function HowItWorks() {
  const [userRole, setUserRole] = useState<"sender" | "traveler">("sender");
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Get user role from localStorage
    const savedRole = localStorage.getItem("airbar-user-role");
    if (savedRole === "sender" || savedRole === "traveler") {
      setUserRole(savedRole);
    }

    // Auto-advance steps when in view
    if (isInView) {
      const timer = setInterval(() => {
        setActiveStep(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isInView]);

  const currentSteps = steps[userRole];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {userRole === "sender"
              ? "Send packages globally in 4 simple steps. Secure, trackable, and up to 70% cheaper than traditional shipping."
              : "Turn your travel plans into income in 4 easy steps. Safe, simple, and rewarding."}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 hidden lg:block">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: "0%" }}
              animate={isInView ? { width: `${(activeStep + 1) * 25}%` } : {}}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {currentSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          y: isActive ? -8 : 0,
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  onClick={() => setActiveStep(index)}
                  className="relative cursor-pointer"
                >
                  <div
                    className={`text-center transition-all duration-300 ${
                      isActive ? "scale-105" : "scale-100 opacity-70"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                        isActive ? step.bgColor : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 transition-colors ${
                          isActive ? step.color : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Step number */}
                    <div
                      className={`absolute -top-2 right-1/2 translate-x-1/2 rounded-full px-2 py-1 text-xs font-bold ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 max-w-[200px] mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href={
              userRole === "sender"
                ? "/send-package"
                : "/add-trip"
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:scale-105"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
