import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "sender",
    route: "New York → London",
    rating: 5,
    text: "Saved $180 on shipping my package to London. The traveler was professional and kept me updated throughout.",
    image: "/api/placeholder/64/64",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "traveler",
    route: "San Francisco → Tokyo",
    rating: 5,
    text: "Made $150 on my business trip to Tokyo. Easy process and great way to offset travel costs.",
    image: "/api/placeholder/64/64",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "sender",
    route: "Miami → Barcelona",
    rating: 5,
    text: "My gift arrived in time for my mom's birthday! Much faster than traditional shipping.",
    image: "/api/placeholder/64/64",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "David Kim",
    role: "traveler",
    route: "Los Angeles → Seoul",
    rating: 5,
    text: "I've carried 12 packages so far and earned over $1,200. Highly recommend for frequent travelers.",
    image: "/api/placeholder/64/64",
    date: "1 week ago",
  },
];

export default function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 6000); // Auto-rotate every 6 seconds

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of satisfied senders and travelers
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-8 md:p-12"
            >
              <Quote className="h-8 w-8 text-blue-600 mb-4" />

              <div className="flex items-start gap-6">
                <img
                  src={reviews[currentIndex].image}
                  alt={reviews[currentIndex].name}
                  className="hidden sm:block h-16 w-16 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {reviews[currentIndex].name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {reviews[currentIndex].route} •{" "}
                        {reviews[currentIndex].date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          reviews[currentIndex].role === "sender"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {reviews[currentIndex].role === "sender"
                          ? "Sender"
                          : "Traveler"}
                      </span>

                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < reviews[currentIndex].rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 italic">
                    "{reviews[currentIndex].text}"
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 transition-all ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                } rounded-full`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
