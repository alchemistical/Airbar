import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frequent Sender",
      location: "San Francisco, USA",
      rating: 5,
      text: "I've saved thousands on shipping my online boutique products internationally. The escrow system gives me peace of mind every time.",
      avatar: "SC",
    },
    {
      name: "Marco Rossi",
      role: "Business Traveler",
      location: "Milan, Italy",
      rating: 5,
      text: "I travel for work monthly and earn extra income by carrying small packages. It's easy money for space I wasn't using anyway.",
      avatar: "MR",
    },
    {
      name: "Aisha Patel",
      role: "Student",
      location: "London, UK",
      rating: 5,
      text: "As an international student, I use Airbar to send care packages home. It's 70% cheaper than traditional shipping!",
      avatar: "AP",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <Card className="overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 hidden md:block">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">
                    {testimonials[currentIndex].avatar}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-gray-700 mb-6">
                  "{testimonials[currentIndex].text}"
                </blockquote>
                
                {/* Author */}
                <div>
                  <div className="font-semibold">{testimonials[currentIndex].name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Trust Indicators */}
      <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>4.8/5 Average Rating</span>
        </div>
        <div>|</div>
        <div>50,000+ Successful Deliveries</div>
        <div>|</div>
        <div>2M+ Happy Users</div>
      </div>
    </div>
  );
}