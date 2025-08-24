import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: "sender" | "traveler";
  country: string;
  avatar: string;
  rating: number;
  text: string;
  savedOrEarned: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "sender",
    country: "US",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "Saved $180 sending electronics to my family in Singapore. The escrow system gave me complete peace of mind.",
    savedOrEarned: "Saved $180"
  },
  {
    id: "2",
    name: "Marco Rodriguez",
    role: "traveler",
    country: "ES",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "I've earned over $2,000 this year just by using my extra luggage space. Perfect side income for frequent flyers.",
    savedOrEarned: "Earned $2,000+"
  },
  {
    id: "3",
    name: "Aisha Patel",
    role: "sender",
    country: "IN",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "The photo proof feature is brilliant. I could see my package at every step. So much better than traditional shipping.",
    savedOrEarned: "65% savings"
  },
  {
    id: "4",
    name: "James Wilson",
    role: "traveler",
    country: "GB",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    text: "KYC verification was quick and easy. Started earning on my first trip to New York. Great platform!",
    savedOrEarned: "$150/trip avg"
  }
];

const metrics = {
  totalDeliveries: "48,000+",
  avgRating: 4.8,
  onTimeRate: "96%",
  starDistribution: [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ]
};

export default function TestimonialsV2() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      track("hp_testimonial_cycle");
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from our global community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Testimonial Carousel */}
          <div className="lg:col-span-2">
            <Card className="p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="w-16 h-16 rounded-full bg-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {currentTestimonial.name}
                      <span className="text-2xl">{getCountryFlag(currentTestimonial.country)}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm px-2 py-1 rounded-full",
                        currentTestimonial.role === "sender"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      )}>
                        {currentTestimonial.role === "sender" ? "Sender" : "Traveler"}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {currentTestimonial.savedOrEarned}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < currentTestimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>

              <blockquote className="text-lg text-gray-700 italic mb-6">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        index === currentIndex
                          ? "bg-primary w-8"
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePrevious}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Total Deliveries</span>
                    <span className="font-bold text-2xl text-gray-900">{metrics.totalDeliveries}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-bold text-2xl text-gray-900">{metrics.avgRating}/5.0</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">On-Time Delivery</span>
                    <span className="font-bold text-2xl text-green-600">{metrics.onTimeRate}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {metrics.starDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-8">{item.stars}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}