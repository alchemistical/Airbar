import { useState } from "react";
import { Link } from "wouter";
import { 
  Plane, 
  Globe, 
  Users, 
  Package, 
  ChevronDown,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Footer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English 🇺🇸");

  const languages = [
    "English 🇺🇸",
    "Français 🇫🇷", 
    "Español 🇪🇸"
  ];

  const stats = [
    { icon: Globe, label: "150+ Countries", value: "150+" },
    { icon: Users, label: "2M+ Users", value: "2M+" },
    { icon: Package, label: "50K+ Deliveries", value: "50K+" }
  ];

  const serviceLinks = [
    { label: "Find Travelers", href: "/find-travelers" },
    { label: "Browse Packages", href: "/browse-packages" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing Calculator", href: "/pricing" },
    { label: "Business Solutions", href: "/business" },
    { label: "API Integration", href: "/api" }
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Safety Guidelines", href: "/safety" },
    { label: "Insurance Claims", href: "/insurance" },
    { label: "Contact Support", href: "/contact" },
    { label: "Community Forum", href: "/community" },
    { label: "Report Issue", href: "/report" }
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Prohibited Items", href: "/prohibited" },
    { label: "About Us", href: "/about" },
    { label: "Admin Portal", href: "/admin" }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/airbar", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/airbar", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/airbar", label: "GitHub" }
  ];

  return (
    <footer className="bg-[#0D1117] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-airbar-blue p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AirBar</span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              The world's most trusted crowdshipping platform connecting travelers with package senders. 
              Safe, reliable, and affordable international delivery made simple.
            </p>
            
            <div className="space-y-3">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-airbar-blue" />
                    <span className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{stat.value}</span> {stat.label.replace(stat.value, "").trim()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-airbar-blue text-sm transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-airbar-blue text-sm transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-airbar-blue text-sm transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 AirBar. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-1"
                  >
                    {selectedLanguage}
                    <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      {language}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Social Icons */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-airbar-blue transition-colors duration-200 p-1"
                      aria-label={social.label}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;