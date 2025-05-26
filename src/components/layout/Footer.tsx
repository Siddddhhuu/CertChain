import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';


const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Brand and Logo */}
        <div className="flex items-center mb-6 md:mb-0">
          {/* Replace with your actual logo component or image */}
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold mr-3"><FileText className="h-8 w-8 text-white-600"/></div> 
          <span className="text-xl font-semibold text-white">CertChain</span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center md:justify-start mb-6 md:mb-0">
          {/* Link 1 */}
          <Link to="/" className="mx-3 relative group">
            <span className="relative">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </span>
          </Link>
          {/* Link 2 */}
          <Link to="/about" className="mx-3 relative group">
             <span className="relative">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </span>
          </Link>
          {/* Link 3 */}
          <Link to="/contact" className="mx-3 relative group">
             <span className="relative">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-500">
          &copy; {year} CertChain. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 