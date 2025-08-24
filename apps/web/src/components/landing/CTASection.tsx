import { motion } from "framer-motion";
import {
  Send,
  Plane,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/90 max-w-2xl mx-auto"
          >
            Join thousands of users saving money and earning from their travels
          </motion.p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {/* Sender CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 text-center"
          >
            <Send className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Send a Package
            </h3>
            <p className="text-gray-600 mb-6">
              Save up to 70% on international shipping
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Average savings of $150 per package</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>2-5 day delivery worldwide</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Escrow protection & insurance</span>
              </div>
            </div>

            <a
              href="/send-package"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:scale-105 w-full justify-center"
            >
              Start Shipping
              <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Traveler CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 text-center"
          >
            <Plane className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Earn While Traveling
            </h3>
            <p className="text-gray-600 mb-6">
              Turn unused luggage space into cash
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Earn $25-150 per trip</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Quick pickup & drop-off</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Verified senders only</span>
              </div>
            </div>

            <a
              href="/dashboard/traveler/trips/addtrip"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-all hover:bg-green-700 hover:scale-105 w-full justify-center"
            >
              Post Your Trip
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
