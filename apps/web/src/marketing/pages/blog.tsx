import Layout from "../components/Layout";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Tips for Safe Package Delivery Through Airbar",
      excerpt: "Learn the best practices for ensuring your packages arrive safely when using peer-to-peer delivery.",
      author: "Sarah Chen",
      date: "January 10, 2024",
      category: "Safety",
      image: "/api/placeholder/600/400",
      readTime: "5 min read"
    },
    {
      title: "How Travelers Can Maximize Their Earnings",
      excerpt: "Discover strategies to earn more money by efficiently using your luggage space on trips.",
      author: "Michael Park",
      date: "January 5, 2024",
      category: "Traveler Tips",
      image: "/api/placeholder/600/400",
      readTime: "8 min read"
    },
    {
      title: "The Environmental Impact of Crowdshipping",
      excerpt: "How peer-to-peer delivery reduces carbon emissions and creates a more sustainable shipping ecosystem.",
      author: "Emma Wilson",
      date: "December 28, 2023",
      category: "Sustainability",
      image: "/api/placeholder/600/400",
      readTime: "6 min read"
    },
    {
      title: "International Shipping: What You Can and Can't Send",
      excerpt: "A comprehensive guide to customs regulations and prohibited items for international deliveries.",
      author: "David Lee",
      date: "December 20, 2023",
      category: "Regulations",
      image: "/api/placeholder/600/400",
      readTime: "10 min read"
    },
    {
      title: "Success Story: How Maria Built a Travel Business with Airbar",
      excerpt: "Meet Maria, who turned her frequent travels into a profitable side business delivering packages.",
      author: "Lisa Martinez",
      date: "December 15, 2023",
      category: "Success Stories",
      image: "/api/placeholder/600/400",
      readTime: "7 min read"
    },
    {
      title: "The Future of Logistics: Peer-to-Peer Delivery",
      excerpt: "Exploring how crowdshipping platforms are reshaping the global logistics industry.",
      author: "Alex Chen",
      date: "December 10, 2023",
      category: "Industry Insights",
      image: "/api/placeholder/600/400",
      readTime: "12 min read"
    }
  ];

  const categories = ["All", "Safety", "Traveler Tips", "Success Stories", "Sustainability", "Regulations", "Industry Insights"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Airbar Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and stories from the world of peer-to-peer delivery
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  category === "All" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4">
                  Featured
                </span>
                <h2 className="text-3xl font-bold mb-4">
                  The Complete Guide to Becoming a Successful Airbar Traveler
                </h2>
                <p className="text-gray-600 mb-6">
                  Everything you need to know about earning money while traveling, from getting started to maximizing your profits.
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">Alex Chen</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>January 15, 2024</span>
                </div>
                <a href="#" className="inline-flex items-center text-primary font-semibold hover:underline">
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 md:h-80"></div>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    <a href="#" className="hover:text-primary transition-colors">
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn btn-outline-primary">
            Load More Articles
          </button>
        </div>

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest tips, stories, and updates delivered to your inbox
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}