import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/logo.png" // use the correct path relative to public folder
                alt="Logo"
                className="w-12 h-12"
              />
              <span className="text-xl font-bold">GHAR SANSAR</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your home with our premium decor items and professional interior design services.
            </p>
            <div className="flex space-x-4">
              <a
  href="https://www.facebook.com/GharSansarshop/"
  className="text-gray-400 hover:text-blue-400 transition-colors"
  target="_blank"
  rel="noopener noreferrer"
>
  <Facebook className="w-5 h-5" />
  <span className="sr-only">Facebook</span>
</a>

              <a href="https://www.youtube.com/@gharsansar_shop" className="text-gray-400 hover:text-blue-400 transition-colors"
              target="_blank"
  rel="noopener noreferrer">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/gharsansar_shop/" className="text-gray-400 hover:text-blue-400 transition-colors"
              target="_blank"
  rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Interior Design
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/interior-design" className="text-gray-400 hover:text-white transition-colors">
                  ICU floring
                </a>
              </li>
              <li>
                <a href="/interior-design" className="text-gray-400 hover:text-white transition-colors">
                  Bubble fountain
                </a>
              </li>
              <li>
                <a href="/interior-design" className="text-gray-400 hover:text-white transition-colors">
                  Wallpaper Rolls
                </a>
              </li>
              <li>
                <a href="/interiror-design" className="text-gray-400 hover:text-white transition-colors">
                  Gym floring
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="w-14 h-14 text-blue-400" />
                <span className="text-gray-400">D.No: 27-14-60, Near Buckingham Post Office, Rajagopalachari Street, Governerpet-520002</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">+91-8121135980</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">gharsansarshop@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Gharsansar. All rights reserved.
            </p>
            {/* <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
