// src/pages/AllProducts.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroBg from '../assets/images/hero3.jpg';

const PRODUCT_API = 'http://localhost:5000/api/product/customer/products';

export default function AllProducts({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('best-selling');
  const [viewMode, setViewMode] = useState('grid');

  const [showPricePopover, setShowPricePopover] = useState(false);
  const [showSortPopover, setShowSortPopover] = useState(false);

  const [ratingsMap, setRatingsMap] = useState({});

  const priceRef = useRef(null);
  const sortRef = useRef(null);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PRODUCT_API);
        const data = res.data.data || [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch ratings for all products (same as HomePage)
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingData = {};

        await Promise.all(
          products.map(async (prod) => {
            try {
              const res = await axios.get(
                `http://localhost:5000/api/reviews/product/${prod.productId}`
              );
              const reviews = res.data.data || [];

              if (reviews.length > 0) {
                const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
                ratingData[prod.productId] = {
                  avg: (total / reviews.length).toFixed(1),
                  count: reviews.length,
                };
              } else {
                ratingData[prod.productId] = { avg: 0, count: 0 };
              }
            } catch (err) {
              ratingData[prod.productId] = { avg: 0, count: 0 };
            }
          })
        );

        setRatingsMap(ratingData);
      } catch (err) {
        console.error("Failed to load product ratings", err);
      }
    };

    if (products.length > 0) {
      fetchRatings();
    }
  }, [products]);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setShowPricePopover(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply filters & sorting
  useEffect(() => {
    let result = [...products];

    if (minPrice !== '') result = result.filter(p => p.sellingPrice >= Number(minPrice));
    if (maxPrice !== '') result = result.filter(p => p.sellingPrice <= Number(maxPrice));

    switch (sortOption) {
      case 'best-selling':
        result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case 'featured':
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case 'alphabetically-a-z':
        result.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'alphabetically-z-a':
        result.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case 'price-low-high':
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'date-old-new':
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'date-new-old':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, minPrice, maxPrice, sortOption]);

  if (loading) {
    return (
      <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className={`h-28 w-28 rounded-full border-6 border-transparent ${darkMode ? 'border-t-emerald-400 border-r-emerald-500/70 border-b-emerald-600/50' : 'border-t-emerald-500 border-r-emerald-600/80 border-b-emerald-700/60'} animate-spin`} style={{ animationDuration: '1.2s' }} />
          <div className={`absolute inset-2 rounded-full border-4 border-transparent ${darkMode ? 'border-t-emerald-300/80 border-l-emerald-400/50' : 'border-t-emerald-400/90 border-l-emerald-500/60'} animate-spin`} style={{ animationDuration: '1.8s', animationDirection: 'reverse' }} />
        </div>
        <p className="text-2xl font-bold tracking-wide text-center">Loading premium collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</p>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="pt-24">
        {/* Hero-like Header */}
        <section className="relative py-16 md:py-24 px-6 lg:px-12 overflow-hidden text-center min-h-[50vh] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src={heroBg}
              alt="3D Printing Background"
              className="w-full h-full object-cover brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
              All Products
            </h1>
            <p className="mt-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              Explore our professional range of 3D printing equipment, filaments, accessories & custom solutions.
            </p>
          </div>
        </section>

        {/* Filter & Sort Bar */}
        <section className="sticky top-16 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="relative" ref={priceRef}>
                <button
                  onClick={() => setShowPricePopover(!showPricePopover)}
                  className="flex items-center gap-2 font-black text-xs md:text-sm tracking-[0.2em] hover:text-cyan-500 transition-colors"
                >
                  Price
                  <svg className={`w-4 h-4 transition-transform ${showPricePopover ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showPricePopover && (
                  <div className="absolute top-full left-0 mt-4 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xl z-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      />
                      <span className="text-gray-400">–</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      />
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                      <button onClick={() => setShowPricePopover(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800">
                        Cancel
                      </button>
                      <button onClick={() => setShowPricePopover(false)} className="px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-xs font-black text-gray-400 tracking-widest">{filteredProducts.length} items</span>
            </div>

            <div className="flex items-center gap-5 md:gap-8">
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSortPopover(!showSortPopover)}
                  className="flex items-center gap-2 font-black text-xs md:text-sm tracking-[0.2em] hover:text-cyan-500 transition-colors"
                >
                  Sort
                  <svg className={`w-4 h-4 transition-transform ${showSortPopover ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showSortPopover && (
                  <div className="absolute top-full right-0 mt-4 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 py-2">
                    {['best-selling', 'featured', 'alphabetically-a-z', 'alphabetically-z-a', 'price-low-high', 'price-high-low', 'date-new-old', 'date-old-new'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortOption(opt); setShowSortPopover(false); }}
                        className={`w-full text-left px-5 py-3 text-sm font-medium ${sortOption === opt ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      >
                        {opt.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-md text-cyan-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h4v4H4V6zm12 0h4v4h-4V6zM4 14h4v4H4v-4zm12 0h4v4h-4v-4z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-md text-cyan-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-[1600px] mx-auto px-5 md:px-8 py-12 md:py-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-2xl font-medium">No products found</p>
              <p className="mt-3">Try adjusting your filters or sort options</p>
            </div>
          ) : (
            <div
              className={`
                ${viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10'
                  : 'flex flex-col gap-6 md:gap-8'
                }
              `}
            >
              {filteredProducts.map((product, index) => {
                const BASE_URL = 'http://localhost:5000';
                const img = product.images?.[0]?.fileUrl
                  ? `${BASE_URL}${product.images[0].fileUrl}`
                  : 'https://via.placeholder.com/400?text=Product';
                const hoverImg = product.images?.[1]?.fileUrl
                  ? `${BASE_URL}${product.images[1].fileUrl}`
                  : img;

                const ratingInfo = ratingsMap[product.productId] || { avg: 0, count: 0 };

                return (
                  <div
                    key={product.productId}
                    className={`
                      group relative cursor-pointer
                      ${viewMode === 'grid'
                        ? `
                          flex-shrink-0 bg-white dark:bg-gray-900/90 
                          rounded-2xl overflow-hidden border border-gray-100/80 dark:border-gray-800/60
                          shadow-md hover:shadow-2xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-900/30
                          transition-all duration-500 ease-out
                          transform hover:-translate-y-3
                          opacity-0 translate-y-10
                          animate-fadeInUp
                        `
                        : `
                          flex items-center gap-6 p-5 md:p-6
                          bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800
                          shadow-sm hover:shadow-xl transition-all duration-400
                        `
                      }
                    `}
                    style={viewMode === 'grid' ? { animationDelay: `${index * 80}ms` } : {}}
                    onClick={() => navigate(`/product/${product.productSlug || product.productId}`)}
                  >
                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'aspect-square' : 'w-44 h-44 md:w-56 md:h-56 flex-shrink-0'}`}>
                      <img
                        src={img}
                        alt={product.productName}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                      />

                      {hoverImg !== img && (
                        <img
                          src={hoverImg}
                          alt={`${product.productName} alt`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                      {/* Sale badge */}
                      {product.mrp > product.sellingPrice && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-2 z-10">
                          SAVE {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}%
                        </div>
                      )}

                      {/* Add to Cart icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Add to cart clicked:", product.productName);
                        }}
                        className={`
                          absolute top-3 right-3 z-20
                          opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-300 ease-out
                          bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
                          p-3 rounded-full shadow-lg hover:bg-yellow-400 hover:text-black
                          border border-gray-200/70 dark:border-gray-700
                          transform hover:scale-110 active:scale-95
                        `}
                        title="Add to Cart"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Details */}
                    <div className={`flex-1 ${viewMode === 'grid' ? 'p-5 text-center' : 'text-left'}`}>
                      <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white line-clamp-2 min-h-[2.8rem] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {product.productName}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 min-h-[3rem]">
                        {product.shortDescription || "Premium 3D printing filament / accessory"}
                      </p>

                      {/* Rating - same as HomePage */}
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                        <div className="flex text-yellow-400 text-sm">
                          {"★".repeat(Math.floor(ratingInfo.avg || 0))}
                          {"☆".repeat(5 - Math.floor(ratingInfo.avg || 0))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {ratingInfo.count > 0
                            ? `${ratingInfo.avg} (${ratingInfo.count})`
                            : "No reviews"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{product.sellingPrice?.toLocaleString()}
                        </span>
                        {product.mrp > product.sellingPrice && (
                          <span className="text-base text-gray-400 line-through">
                            ₹{product.mrp?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* View Details - smaller & unique style */}
                      <div className={`mt-5 ${viewMode === 'list' ? 'block' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'}`}>
                        <button className="
                          inline-flex items-center gap-1.5 px-5 py-2 
                          text-sm font-medium
                          bg-gradient-to-r from-cyan-600/10 to-blue-600/10 
                          dark:from-cyan-500/20 dark:to-blue-500/20
                          hover:from-cyan-600/20 hover:to-blue-600/20
                          border border-cyan-500/40 dark:border-cyan-400/30
                          text-cyan-700 dark:text-cyan-300
                          rounded-full
                          shadow-sm hover:shadow-md
                          transition-all duration-300
                          hover:scale-105 active:scale-95
                        ">
                          View Details
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}