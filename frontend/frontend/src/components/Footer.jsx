
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
} from "react-icons/fa";

import {
  MdEmail,
  MdLocationOn,
} from "react-icons/md";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Footer Sections */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-8">

          {/* Logo Section */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500">
              MahobaMart
            </h2>

            <p className="text-gray-400 text-sm sm:text-base mt-3 sm:mt-4 leading-6 max-w-sm">
              Fast delivery of food, groceries,
              medicines and daily essentials
              across Mahoba.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
              <li>
                <Link to="/" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/products" className="hover:text-green-400 transition">
                  Products
                </Link>
              </li>

              <li>
                <Link to="/shops" className="hover:text-green-400 transition">
                  Shops
                </Link>
              </li>

              <li>
                <Link to="/orders" className="hover:text-green-400 transition">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">
              Categories
            </h3>

            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
              <li>Food</li>
              <li>Grocery</li>
              <li>Medicine</li>
              <li>Fruits & Vegetables</li>
              <li>Pickup & Drop</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-400 text-sm sm:text-base">

              <div className="flex items-start gap-2">
                <MdLocationOn size={20} className="shrink-0 mt-0.5" />
                <span>Mahoba, Uttar Pradesh</span>
              </div>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 hover:text-green-400 transition"
              >
                <FaPhoneAlt size={16} className="shrink-0" />
                <span>+91 9876543210</span>
              </a>

              <a
                href="mailto:support@mahobamart.com"
                className="flex items-start gap-2 hover:text-green-400 transition break-all"
              >
                <MdEmail size={20} className="shrink-0" />
                <span>support@mahobamart.com</span>
              </a>

            </div>
          </div>

        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 sm:gap-6 mt-8 sm:mt-10">

          <a
            href="#"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition"
          >
            <FaFacebookF size={18} />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition"
          >
            <FaInstagram size={18} />
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition"
          >
            <FaTwitter size={18} />
          </a>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-7 sm:mt-8 pt-5 sm:pt-6 text-center text-gray-500 text-xs sm:text-sm leading-5">
          © {new Date().getFullYear()} MahobaMart.
          All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;

