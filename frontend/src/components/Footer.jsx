// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black text-gray-600 dark:text-gray-400 py-16 border-t border-gray-100 dark:border-gray-900">
      {/* Container fix: Isme se side ki extra space handle ho jayegi */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand Identity */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              3D Hub<span className="text-cyan-500">.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium 3D printing solutions, high-grade filaments, and professional accessories. 
              Engineering the future of creation.
            </p>
            {/* Social Icons - Redesigned to be cleaner */}
            {/* Social Icons - Fixed href warnings */}
<div className="flex gap-5 text-gray-400 dark:text-gray-600">
  <a 
    href="https://facebook.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-cyan-500 transition-colors"
    aria-label="Facebook"
  >
    <i className="fab fa-facebook-f"></i>
  </a>
  <a 
    href="https://instagram.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-cyan-500 transition-colors"
    aria-label="Instagram"
  >
    <i className="fab fa-instagram"></i>
  </a>
  <a 
    href="https://twitter.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-cyan-500 transition-colors"
    aria-label="Twitter"
  >
    <i className="fab fa-twitter"></i>
  </a>
  <a 
    href="https://linkedin.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-cyan-500 transition-colors"
    aria-label="LinkedIn"
  >
    <i className="fab fa-linkedin-in"></i>
  </a>
</div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Explore</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/all-products" className="hover:text-cyan-500 transition-colors">All Products</Link></li>
              <li><Link to="/about" className="hover:text-cyan-500 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-500 transition-colors">Get in Touch</Link></li>
              <li><Link to="/support" className="hover:text-cyan-500 transition-colors">Tech Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Legal</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/shipping" className="hover:text-cyan-500 transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter - Modern UI */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Newsletter</h3>
            <p className="text-xs font-medium uppercase tracking-tight text-gray-400">Join our mailing list for updates</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-full py-4 px-6 text-sm focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            © {new Date().getFullYear()} 3D Printer Hub. Locally Crafted Excellence.
          </p>
          <div className="flex gap-4 items-center">
             <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}