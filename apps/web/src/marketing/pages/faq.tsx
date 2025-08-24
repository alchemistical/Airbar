import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import faqData from "../data/faq.json";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories = ["Getting Started", "Sending Packages", "Traveling", "Payments", "Safety", "Account"];
  
  const filteredFAQs = faqData.filter((item: FAQItem) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-8">
              Find answers to common questions about using Airbar
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-10 pr-4 py-3 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-4xl">
            {searchTerm ? (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Found {filteredFAQs.length} results for "{searchTerm}"
                </p>
                <div className="space-y-4">
                  {filteredFAQs.map((item: FAQItem, index: number) => (
                    <Card key={index} className="cursor-pointer" onClick={() => toggleExpanded(index)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{item.question}</h3>
                            {expandedItems.includes(index) && (
                              <p className="text-gray-600 mt-4">{item.answer}</p>
                            )}
                          </div>
                          {expandedItems.includes(index) ? (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {categories.map((category) => (
                  <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">{category}</h2>
                    <div className="space-y-4">
                      {faqData
                        .filter((item: FAQItem) => item.category === category)
                        .map((item: FAQItem, index: number) => {
                          const globalIndex = faqData.indexOf(item);
                          return (
                            <Card key={globalIndex} className="cursor-pointer" onClick={() => toggleExpanded(globalIndex)}>
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold mb-2">{item.question}</h3>
                                    {expandedItems.includes(globalIndex) && (
                                      <p className="text-gray-600 mt-4">{item.answer}</p>
                                    )}
                                  </div>
                                  {expandedItems.includes(globalIndex) ? (
                                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-lg text-gray-600 mb-8">Our support team is here to help</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                Contact Support
              </a>
              <a href="/support" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Visit Help Center
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}