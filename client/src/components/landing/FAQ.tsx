import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = {
  sender: [
    {
      question: "How does Airbar protect my package?",
      answer:
        "Every delivery is protected by our secure escrow system. Payment is held safely until you confirm receipt. All travelers undergo KYC verification, and you can track your package in real-time throughout the journey.",
    },
    {
      question: "What can I send through Airbar?",
      answer:
        "You can send most everyday items like documents, electronics, clothing, cosmetics, and gifts. Prohibited items include illegal goods, hazardous materials, liquids over 100ml, and items restricted by airline regulations.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Prices vary based on package size, weight, and destination. On average, Airbar is 50-70% cheaper than traditional shipping. You'll see the exact price when you match with a traveler.",
    },
    {
      question: "What if something goes wrong?",
      answer:
        "We have a comprehensive dispute resolution system. If issues arise, our support team mediates between parties. Packages are photographed at pickup and delivery, and our escrow system ensures fair resolution.",
    },
  ],
  traveler: [
    {
      question: "How much can I earn?",
      answer:
        "Earnings depend on your route and available space. Most travelers earn $50-200 per trip. International routes and business class travelers with more baggage allowance typically earn more.",
    },
    {
      question: "Is it legal to carry packages for others?",
      answer:
        "Yes, peer-to-peer delivery is legal in most countries. However, you must declare items at customs if required. We provide documentation and guidance to ensure compliance with local regulations.",
    },
    {
      question: "What are my responsibilities?",
      answer:
        "You need to: verify package contents match the description, take photos at pickup/delivery, keep packages secure during travel, and deliver within the agreed timeframe. You have the right to refuse suspicious packages.",
    },
    {
      question: "When do I get paid?",
      answer:
        "Payment is released immediately after the sender confirms delivery. Funds are available for withdrawal instantly, or you can keep them in your Airbar wallet for future trips.",
    },
  ],
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<"sender" | "traveler">("sender");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const currentFAQs = faqs[userRole];

  return (
    <section ref={sectionRef} id="faq" className="py-20 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Role Toggle */}
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-lg p-1 mt-6">
            <button
              onClick={() => {
                setUserRole("sender");
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                userRole === "sender"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              I want to send
            </button>
            <button
              onClick={() => {
                setUserRole("traveler");
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                userRole === "traveler"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              I want to travel
            </button>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {currentFAQs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={`${userRole}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    </motion.div>
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 text-gray-600">{faq.answer}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/dashboard/support"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact our support team
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
