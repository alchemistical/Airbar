import Layout from "../components/Layout";
import { FileText, Download, Mail } from "lucide-react";

export default function Press() {
  const pressReleases = [
    {
      date: "December 15, 2023",
      title: "Airbar Reaches 2 Million Users Milestone",
      description: "Peer-to-peer delivery platform celebrates major growth milestone with expansion into 20 new countries.",
      link: "#"
    },
    {
      date: "October 5, 2023",
      title: "Airbar Raises $25M Series B to Expand Global Operations",
      description: "Funding round led by Global Ventures to accelerate international growth and enhance platform security.",
      link: "#"
    },
    {
      date: "July 20, 2023",
      title: "Airbar Partners with Major Airlines for Seamless Integration",
      description: "New partnerships make it easier for travelers to offer delivery services on their trips.",
      link: "#"
    },
    {
      date: "March 10, 2023",
      title: "Study Shows Airbar Reduces Shipping Costs by 80%",
      description: "Independent research confirms significant cost savings for international package delivery.",
      link: "#"
    }
  ];

  const mediaCoverage = [
    { outlet: "TechCrunch", title: "How Airbar is disrupting the $500B logistics industry", date: "Nov 2023" },
    { outlet: "Forbes", title: "The sharing economy comes to international shipping", date: "Oct 2023" },
    { outlet: "The Wall Street Journal", title: "Travelers turn empty luggage space into profit", date: "Sep 2023" },
    { outlet: "BBC", title: "The future of sustainable shipping", date: "Aug 2023" }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Press Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the latest news about Airbar, access our media kit, and find resources for journalists.
          </p>
        </div>

        {/* Contact Section */}
        <section className="mb-16 bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="md:flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Media Inquiries</h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                For press inquiries, interviews, or additional information
              </p>
            </div>
            <a href="mailto:press@airbar.com" className="btn btn-primary inline-flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              press@airbar.com
            </a>
          </div>
        </section>

        {/* Recent Press Releases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Recent Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="md:flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{release.date}</p>
                    <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                    <p className="text-gray-600">{release.description}</p>
                  </div>
                  <a href={release.link} className="mt-4 md:mt-0 md:ml-6 text-primary font-medium hover:underline inline-flex items-center">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">In the News</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaCoverage.map((coverage, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{coverage.outlet}</h3>
                  <span className="text-sm text-gray-500">{coverage.date}</span>
                </div>
                <p className="text-gray-700">{coverage.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Media Kit</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Brand Guidelines</h3>
              <p className="text-gray-600 text-sm mb-4">Logo usage, colors, and typography</p>
              <button className="text-primary font-medium hover:underline inline-flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Company Fact Sheet</h3>
              <p className="text-gray-600 text-sm mb-4">Key statistics and company information</p>
              <button className="text-primary font-medium hover:underline inline-flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Executive Bios</h3>
              <p className="text-gray-600 text-sm mb-4">Leadership team biographies and photos</p>
              <button className="text-primary font-medium hover:underline inline-flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Download ZIP
              </button>
            </div>
          </div>
        </section>

        {/* Company Facts */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">Quick Facts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company Overview</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Founded:</strong> 2021</li>
                <li><strong>Headquarters:</strong> San Francisco, CA</li>
                <li><strong>Employees:</strong> 150+</li>
                <li><strong>Total Funding:</strong> $45M</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform Statistics</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Active Users:</strong> 2M+</li>
                <li><strong>Countries:</strong> 150+</li>
                <li><strong>Deliveries Completed:</strong> 50K+</li>
                <li><strong>Average Cost Savings:</strong> 80%</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Executive Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Executive Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Alex Chen</h3>
              <p className="text-gray-600 mb-2">CEO & Co-founder</p>
              <p className="text-sm text-gray-500">Former VP of Product at Uber</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-gray-600 mb-2">CTO & Co-founder</p>
              <p className="text-sm text-gray-500">Former Engineering Director at Airbnb</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Michael Park</h3>
              <p className="text-gray-600 mb-2">COO & Co-founder</p>
              <p className="text-sm text-gray-500">Former Head of Operations at DoorDash</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}