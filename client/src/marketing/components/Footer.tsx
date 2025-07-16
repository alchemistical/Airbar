import { Link } from "wouter";
import { Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const footerLinks = {
    services: [
      { label: "Send a Package", href: "/send-package" },
      { label: "List Your Trip", href: "/dashboard/traveler/trips/addtrip" },
      { label: "Find Travelers", href: "/marketplace/trips" },
      { label: "Browse Packages", href: "/browse-packages" },
    ],
    support: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Safety Guidelines", href: "/safety" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Prohibited Items", href: "/safety#prohibited" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  };

  return (
    <footer className="bg-gray-1000 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl py-12 md:py-16">
        {/* Brand Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Airbar</h3>
          <p className="text-gray-400 max-w-2xl mb-8">
            Connecting travelers with people who need packages delivered. Ship globally at a fraction of the cost while helping travelers earn from their unused luggage space.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-gray-800">
            <div>
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">2M+</div>
              <div className="text-sm text-gray-400">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-gray-400">Deliveries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-gray-400">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4 text-[#000000]">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-[#000000]">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Airbar. All rights reserved.
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>English (USD)</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {isLangOpen && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg py-2 min-w-[200px]">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors">
                  English (USD)
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors">
                  Français (EUR)
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors">
                  Español (EUR)
                </button>
              </div>
            )}
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}