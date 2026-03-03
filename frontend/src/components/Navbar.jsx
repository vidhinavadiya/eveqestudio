// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar'; // Import karein
import CategoriesMenu from './CategoriesMenu';

export default function Navbar({ 
  isLoggedIn, 
  onLogout, 
  cartItemCount = 0,
  darkMode,
  toggleDarkMode
}) {
  // ← cartItemCount prop add kiya (optional)
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.drawer')) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

 return (
  
    <>
    <header className="fixed top-0 left-0 right-0 z-[1000] flex flex-col w-full">
        
        {/* 1. Announcement Bar Sabse Upar */}
        <AnnouncementBar />
      <nav
        className={`
          w-full transition-all duration-500
          ${scrolled
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800'
            : 'bg-white/60 dark:bg-black/20 backdrop-blur-md shadow-sm'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile Hamburger - left */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100/40 dark:hover:bg-gray-800/40 transition"
                aria-label="Toggle menu"
              >
                <svg className="w-7 h-7 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Logo - center mobile, left desktop */}
            <div className="flex-1 flex justify-center md:justify-start md:flex-none">
              <Link
                to="/home"
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black dark:text-white hover:opacity-80 transition-opacity duration-300"
              >
                3D Printer
              </Link>
            </div>

            {/* Desktop Navigation - center */}
            <div className="hidden md:flex items-center justify-center space-x-10 lg:space-x-12 flex-1">
              <Link to="/home" className="text-gray-800 dark:text-gray-200 font-medium hover:text-black dark:hover:text-white transition-colors duration-300">
                Home
              </Link>
              <CategoriesMenu isMobile={false} />
              <Link to="/about" className="text-gray-800 dark:text-gray-200 font-medium hover:text-black dark:hover:text-white transition-colors duration-300">
                About
              </Link>
              <Link to="/contact" className="text-gray-800 dark:text-gray-200 font-medium hover:text-black dark:hover:text-white transition-colors duration-300">
                Contact
              </Link>
            </div>
            {isLoggedIn && (
  <Link
    to="/my-orders"
    className={`p-2 rounded-full transition-all duration-300 ${
      scrolled ? 'hover:bg-gray-200/80 dark:hover:bg-gray-700/70' : 'hover:bg-gray-100/40 dark:hover:bg-gray-800/40'
    }`}
    title="My Orders"
  >
    <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  </Link>
)}

            {/* Right Icons */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 md:space-x-5">
  {/* Dark Mode Toggle */}
  <button
    onClick={toggleDarkMode}
    className={`p-2 rounded-full transition-all duration-300 ${
      scrolled
        ? 'hover:bg-gray-200/80 dark:hover:bg-gray-700/70'
        : 'hover:bg-gray-100/40 dark:hover:bg-gray-800/40'
    }`}
    aria-label="Toggle dark mode"
    title="Toggle Theme"
  >
{darkMode ? (
  <svg
    className="w-10 h-10 text-gray-200"
    viewBox="0 0 60 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Active left capsule */}
    <rect x="3" y="3" width="27" height="24" rx="12" fill="currentColor" opacity="0.2" />

    {/* Moon */}
    <circle cx="16.5" cy="15" r="9" fill="currentColor" />
    <circle cx="23" cy="11" r="7" fill="#000" />

    {/* Inactive right */}
    <rect x="33" y="9" width="4" height="12" rx="2" fill="currentColor" />
    <circle cx="45" cy="15" r="6" fill="currentColor" opacity="0.65" />
  </svg>
) : (
  <svg
    className="w-10 h-10 text-gray-900"
    viewBox="0 0 60 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Active right capsule */}
    <rect x="30" y="3" width="27" height="24" rx="12" fill="currentColor" opacity="0.2" />

    {/* Sun */}
    <circle cx="43.5" cy="15" r="9" fill="currentColor" />
    <circle cx="43.5" cy="15" r="4" fill="#000" />

    {/* Inactive left */}
    <circle cx="16.5" cy="15" r="6" fill="currentColor" opacity="0.7" />
    <rect x="8" y="12" width="17" height="6" rx="3" fill="currentColor" opacity="0.6" />
  </svg>
)}
</button>

   {/* Search */}
  <button
    onClick={() => setShowSearch(true)}
    className={`p-2 rounded-full transition-all duration-300 ${
      scrolled
        ? 'hover:bg-gray-200/80 dark:hover:bg-gray-700/70'
        : 'hover:bg-gray-100/40 dark:hover:bg-gray-800/40'
    }`}
    title="Search"
  >
    <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </button>
     {/* Cart */}
  <Link
    to="/cart"
    className="relative p-2 rounded-full transition-all duration-300 hover:bg-gray-100/40 dark:hover:bg-gray-800/40"
    title="Cart"
  >
    <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {cartItemCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1.5 shadow-sm">
        {cartItemCount > 99 ? '99+' : cartItemCount}
      </span>
    )}
  </Link>

     {/* Profile */}
  <button
    onClick={() => (isLoggedIn ? navigate('/profile') : navigate('/auth'))}
    className={`p-2 rounded-full transition-all duration-300 ${
      scrolled
        ? 'hover:bg-gray-200/80 dark:hover:bg-gray-700/70'
        : 'hover:bg-gray-100/40 dark:hover:bg-gray-800/40'
    }`}
    title={isLoggedIn ? 'Profile' : 'Login'}
  >
    {isLoggedIn ? (
      <svg className="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ) : (
      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )}
  </button>

              {isLoggedIn && (
                <button
                  onClick={onLogout}
                  className="hidden md:block px-5 py-2.5 rounded-lg font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
</header>
      {/* Mobile Drawer */}
{/* Mobile Drawer - NOW FROM LEFT SIDE */}
<div
  className={`
    fixed inset-y-0 left-0 z-[1100]          {/* ← increased significantly */}
    w-4/5 max-w-sm
    bg-white/95 dark:bg-black/95 backdrop-blur-xl
    border-r border-gray-200 dark:border-gray-800
    shadow-2xl
    transform transition-transform duration-500 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
        <div className="p-6 flex flex-col h-full drawer">
          <div className="flex justify-between items-center mb-10">
            <span className="text-2xl font-extrabold text-black dark:text-white">
              3D Printer Hub
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/40"
            >
              <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-6 text-center text-lg font-medium">
            <Link to="/home" onClick={() => setIsOpen(false)}>Home</Link>
            <CategoriesMenu isMobile={true} closeDrawer={() => setIsOpen(false)} />
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>

          <div className="mt-auto pt-10">
            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full py-4 rounded-xl font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setIsOpen(false); }}
                className="w-full py-4 rounded-xl font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay - same, ab left drawer ke saath bhi kaam karega */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Search Modal - same as before */}
      {showSearch && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20 md:pt-32"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products... (e.g. PLA filament, 3D printer)"
                className="w-full px-6 py-5 text-lg md:text-xl bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {searchQuery.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Searching for: <span className="font-medium text-gray-900 dark:text-white">{searchQuery}</span>
                </p>
              </div>
            )}

            <div className="px-6 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}