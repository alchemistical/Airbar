import Layout from "../components/Layout";
import { MapPin, Users, Briefcase, Heart } from "lucide-react";

export default function Careers() {
  const openPositions = [
    {
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description: "Build scalable systems that power our global delivery network."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description: "Shape the user experience for millions of users worldwide."
    },
    {
      title: "Trust & Safety Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      description: "Ensure our platform remains safe and trustworthy for all users."
    },
    {
      title: "Data Scientist",
      department: "Analytics",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description: "Use data to optimize our matching algorithms and user experience."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Grow our community and tell the Airbar story to the world."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision coverage for you and your family"
    },
    {
      icon: Users,
      title: "Remote First",
      description: "Work from anywhere with flexible hours and home office stipend"
    },
    {
      icon: Briefcase,
      title: "Growth & Learning",
      description: "$2,000 annual learning budget and mentorship programs"
    },
    {
      icon: MapPin,
      title: "Travel Perks",
      description: "Annual travel credits and team retreats around the world"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join the Airbar Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the future of global shipping. We're looking for passionate people who want to make sending packages as easy as booking a ride.
          </p>
        </div>

        {/* Why Airbar Section */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">Why Work at Airbar?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Mission-Driven Work</h3>
              <p className="text-gray-600 mb-6">
                We're not just building a shipping platform – we're creating connections between people across the globe and making international commerce more accessible.
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Global Impact</h3>
              <p className="text-gray-600">
                Your work will directly impact millions of users in over 150 countries, helping them save money and connect with others worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Innovative Culture</h3>
              <p className="text-gray-600 mb-6">
                We encourage experimentation, value diverse perspectives, and believe the best ideas can come from anywhere.
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Growth Opportunities</h3>
              <p className="text-gray-600">
                As a fast-growing startup, you'll have the opportunity to wear many hats, learn rapidly, and shape the direction of the company.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="md:flex justify-between items-start">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                    <p className="text-gray-600 mb-2">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <a href={`mailto:careers@airbar.com?subject=Application for ${position.title}`} 
                     className="btn btn-primary inline-block">
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Trust First</h3>
              <p className="text-gray-600">
                We build trust with our users and each other through transparency, reliability, and honest communication.
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Think Global</h3>
              <p className="text-gray-600">
                We consider the global impact of our decisions and build for users from all backgrounds and locations.
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Move Fast</h3>
              <p className="text-gray-600">
                We ship quickly, learn from feedback, and iterate. Perfect is the enemy of good.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gray-900 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're always looking for exceptional people. Send us your resume and tell us how you can contribute to Airbar's mission.
          </p>
          <a href="mailto:careers@airbar.com" className="btn btn-white">
            Get in Touch
          </a>
        </section>
      </div>
    </Layout>
  );
}