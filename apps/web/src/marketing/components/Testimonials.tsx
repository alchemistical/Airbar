import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frequent Sender",
      location: "San Francisco, USA",
      rating: 5,
      text: "I've saved thousands on shipping my online boutique products internationally. The escrow system gives me peace of mind every time.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      country: "🇺🇸",
    },
    {
      name: "Marco Rossi",
      role: "Business Traveler",
      location: "Milan, Italy",
      rating: 5,
      text: "I travel for work monthly and earn extra income by carrying small packages. It's easy money for space I wasn't using anyway.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      country: "🇮🇹",
    },
    {
      name: "Aisha Patel",
      role: "Student",
      location: "London, UK",
      rating: 5,
      text: "As an international student, I use Airbar to send care packages home. It's 70% cheaper than traditional shipping!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      country: "🇬🇧",
    },
    {
      name: "Carlos Mendez",
      role: "Entrepreneur",
      location: "Mexico City",
      rating: 5,
      text: "Perfect for my e-commerce business. I ship products globally at a fraction of the cost. Customer service is excellent.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      country: "🇲🇽",
    },
    {
      name: "Yuki Tanaka",
      role: "Flight Attendant",
      location: "Tokyo, Japan",
      rating: 5,
      text: "I fly internationally twice a week. Airbar helps me monetize my travel while helping others. Win-win!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      country: "🇯🇵",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const starDistribution = {
    5: 89,
    4: 8,
    3: 2,
    2: 1,
    1: 0,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-start gap-6">
              {/* Avatar with photo */}
              <div className="flex-shrink-0 hidden md:block">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                {/* Rating with distribution */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < testimonials[currentIndex].rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "fill-gray-200 text-gray-200"
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {testimonials[currentIndex].rating}.0
                  </span>
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentIndex].text}"
                </blockquote>
                
                {/* Author with country flag */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{testimonials[currentIndex].name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{testimonials[currentIndex].role}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonials[currentIndex].location}
                      </span>
                    </div>
                  </div>
                  <span className="text-2xl">{testimonials[currentIndex].country}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          <AnimatedButton
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </AnimatedButton>
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <AnimatedButton
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </AnimatedButton>
        </div>
      </div>
      
      {/* Enhanced Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {/* Rating Distribution */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Rating Distribution</h4>
          <div className="space-y-2">
            {Object.entries(starDistribution).reverse().map(([stars, percentage]) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm w-4">{stars}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-10">{percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Community Stats</h4>
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold text-primary">50,000+</div>
              <div className="text-sm text-gray-600">Successful Deliveries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4.8/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">99.2%</div>
              <div className="text-sm text-gray-600">On-time Delivery Rate</div>
            </div>
          </div>
        </Card>

        {/* As Seen In */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">As Featured In</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <div>• TechCrunch - "Disrupting Global Shipping"</div>
            <div>• Forbes - "Top 10 Sharing Economy Startups"</div>
            <div>• CNN - "The Future of Package Delivery"</div>
            <div>• Bloomberg - "Crowdshipping Goes Mainstream"</div>
          </div>
        </Card>
      </div>
    </div>
  );
}