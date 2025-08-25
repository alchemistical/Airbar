import Layout from "../components/Layout";
import { Users, Globe, Shield, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Airbar</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a global community that makes shipping more affordable, sustainable, and human-centered by connecting people who need to send packages with travelers heading their way.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                To revolutionize global shipping by creating a trusted peer-to-peer delivery network that benefits both senders and travelers while reducing the environmental impact of traditional logistics.
              </p>
              <p className="text-lg text-gray-600">
                We believe that millions of travelers with unused luggage space can help millions of people send packages affordably, creating a win-win ecosystem that brings the world closer together.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2M+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-gray-600">Deliveries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">80%</div>
                  <div className="text-sm text-gray-600">Cost Savings</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community First</h3>
              <p className="text-gray-600">
                Building trust and connections between people across the globe
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-gray-600">
                Making international shipping accessible and affordable for everyone
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety & Trust</h3>
              <p className="text-gray-600">
                Ensuring secure transactions and verified users for peace of mind
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Reducing carbon footprint by utilizing existing travel routes
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Airbar was born from a simple observation: millions of travelers fly with empty luggage space while millions of people struggle with expensive international shipping costs.
            </p>
            <p className="mb-4">
              Founded in 2021 by a team of travelers and logistics experts, we set out to create a platform that would connect these two groups, creating value for both while building a more sustainable shipping ecosystem.
            </p>
            <p className="mb-4">
              What started as a small community of frequent travelers has grown into a global network spanning over 150 countries. Every day, our users help each other send everything from forgotten passports to gifts for loved ones, business documents to online purchases.
            </p>
            <p>
              Today, we're proud to be the world's largest peer-to-peer delivery platform, but we're just getting started. Our vision is to make Airbar the first choice for anyone looking to send packages internationally.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Alex Chen</h3>
              <p className="text-gray-600">CEO & Co-founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-gray-600">CTO & Co-founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Michael Park</h3>
              <p className="text-gray-600">COO & Co-founder</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a traveler looking to earn or someone who needs to send a package, there's a place for you at Airbar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/send-package" className="btn btn-white">
              Send a Package
            </a>
            <a href="/add-trip" className="btn btn-outline-white">
              Become a Traveler
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}