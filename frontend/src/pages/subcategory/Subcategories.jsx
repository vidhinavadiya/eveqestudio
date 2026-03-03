import React, { useEffect, useState, useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const PRODUCT_API = 'http://localhost:5000/api/product/customer/products';
const SUBCATEGORY_API = 'http://localhost:5000/api/subcategory/public';

export default function Subcategories({ isLoggedIn, onLogout, darkMode, toggleDarkMode}) {
  const { categorySlug, subSlug } = useParams();
  const [subcategory, setSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('best-selling');

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showPricePopover, setShowPricePopover] = useState(false);
  const [showSortPopover, setShowSortPopover] = useState(false);

  const [viewMode, setViewMode] = useState('grid');

  const priceRef = useRef(null);
  const sortRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const subRes = await axios.get(SUBCATEGORY_API);
        const foundSub = subRes.data.data.find(
          (sub) =>
            sub.slug === subSlug &&
            sub.category?.categorySlug === categorySlug
        );
        if (!foundSub) {
          setError('Subcategory not found');
          return;
        }
        setSubcategory(foundSub);

        const productRes = await axios.get(PRODUCT_API);
        const filtered = productRes.data.data.filter(
          (product) =>
            Number(product.categoryId) === Number(foundSub.category.id) &&
            Number(product.subcategoryId) === Number(foundSub.id)
        );
        setProducts(filtered);
        setFilteredProducts(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categorySlug, subSlug]);

  // Close popovers on outside click (desktop)
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

    if (minPrice !== '') {
      result = result.filter(p => p.sellingPrice >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => p.sellingPrice <= Number(maxPrice));
    }

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
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-4
        ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}
      `}
    >
      {/* Compact spinning loader - no blur */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Main spinning ring */}
        <div
          className={`
            h-28 w-28 rounded-full border-6 border-transparent
            ${darkMode 
              ? 'border-t-emerald-400 border-r-emerald-500/70 border-b-emerald-600/50' 
              : 'border-t-emerald-500 border-r-emerald-600/80 border-b-emerald-700/60'}
            animate-spin
          `}
          style={{ animationDuration: '1.2s' }}
        />

        {/* Inner ring - opposite direction */}
        <div
          className={`
            absolute inset-2 rounded-full border-4 border-transparent
            ${darkMode 
              ? 'border-t-emerald-300/80 border-l-emerald-400/50' 
              : 'border-t-emerald-400/90 border-l-emerald-500/60'}
            animate-spin
          `}
          style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Smaller text */}
      <div className="text-center space-y-2">
        <p
          className={`
            text-2xl sm:text-3xl font-bold tracking-wide
            ${darkMode ? 'text-white' : 'text-gray-900'}
          `}
        >
          Loading premium collection...
        </p>

        <p
          className={`
            text-base sm:text-lg font-medium opacity-80
            ${darkMode ? 'text-gray-300' : 'text-gray-700'}
          `}
        >
          Preparing your experience
        </p>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Oops!</p>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar 
              isLoggedIn={isLoggedIn} 
              onLogout={onLogout} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode} 
            />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-pink-50/30 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10" />
        <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>
        <div className="relative max-w-7xl mx-auto z-10 text-center">
          {subcategory?.subCategoryImage && (
            <div className="mb-8 transform hover:scale-105 transition-transform duration-700">
              <img
                src={`http://localhost:5000/uploads/subcategories/${subcategory.subCategoryImage}`}
                alt={subcategory.subCategoryName}
                className="w-32 h-32 md:w-40 md:h-40 mx-auto object-cover rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50"
              />
            </div>
          )}
          <p className="text-sm md:text-base uppercase tracking-[0.3em] font-medium text-indigo-600 dark:text-indigo-400 mb-4">
            {subcategory?.category?.categoryName || 'Collection'}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {subcategory?.subCategoryName || 'Premium Collection'}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover handcrafted elegance with cutting-edge 3D printing technology.
          </p>
        </div>
      </section>

{/* Filter & Sort Bar - Left: Price + Items | Right: Sort + View Toggle */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-5 sticky top-0 z-20 border-b border-gray-200/30 dark:border-gray-800/30 backdrop-blur-sm">
  <div className="flex items-center justify-between gap-4 md:gap-8 text-sm md:text-base whitespace-nowrap">
    
    {/* Left Group: Price + Items */}
    <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
      {/* Price */}
      <div className="relative" ref={priceRef}>
        <button
          className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          onClick={() => {
            if (window.innerWidth < 768) {
              setShowFilterDrawer(true);
            } else {
              setShowPricePopover(!showPricePopover);
              setShowSortPopover(false);
            }
          }}
        >
          Price
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop Price Popover */}
        {showPricePopover && window.innerWidth >= 768 && (
          <div className="absolute top-full left-0 mt-3 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 z-50">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Price Range</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowPricePopover(false)}
                className="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPricePopover(false)}
                className="px-5 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Total Items */}
      <div className="text-gray-700 dark:text-gray-300 font-medium flex-shrink-0">
        {filteredProducts.length} items
      </div>
    </div>

    {/* Right Group: Sort + View Toggle */}
    <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
      {/* Sort */}
      <div className="relative" ref={sortRef}>
        <button
          className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          onClick={() => {
            if (window.innerWidth < 768) {
              setShowFilterDrawer(true);
            } else {
              setShowSortPopover(!showSortPopover);
              setShowPricePopover(false);
            }
          }}
        >
          Sort
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop Sort Popover */}
        {showSortPopover && window.innerWidth >= 768 && (
          <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 z-50">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="best-selling">Best Selling</option>
              <option value="featured">Featured</option>
              <option value="alphabetically-a-z">A-Z</option>
              <option value="alphabetically-z-a">Z-A</option>
              <option value="price-low-high">Price Low to High</option>
              <option value="price-high-low">Price High to Low</option>
              <option value="date-old-new">Old to New</option>
              <option value="date-new-old">New to Old</option>
            </select>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSortPopover(false)}
                className="px-5 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid/List Toggle */}
      <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-lg border border-gray-300/50 dark:border-gray-600/50 overflow-hidden flex-shrink-0">
        <button
          className={`p-2 md:p-2.5 ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200/70 dark:hover:bg-gray-700/70'}`}
          onClick={() => setViewMode('grid')}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          className={`p-2 md:p-2.5 ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200/70 dark:hover:bg-gray-700/70'}`}
          onClick={() => setViewMode('list')}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</section>

      {/* Mobile Drawer */}
      {showFilterDrawer && (
        <div
          className="fixed inset-0 bg-black/60 z-[10000] md:hidden"
          onClick={() => setShowFilterDrawer(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform translate-x-0 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filter & Sort</h3>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Price Range
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="best-selling">Best Selling</option>
                  <option value="featured">Featured</option>
                  <option value="alphabetically-a-z">A-Z</option>
                  <option value="alphabetically-z-a">Z-A</option>
                  <option value="price-low-high">Price Low to High</option>
                  <option value="price-high-low">Price High to Low</option>
                  <option value="date-old-new">Old to New</option>
                  <option value="date-new-old">New to Old</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
 {/* Products Grid */}
<section className="max-w-7xl mx-auto px-6 pb-32">
  {filteredProducts.length === 0 ? (
    <div className="text-center py-24">
      <p className="text-2xl font-medium text-gray-500 dark:text-gray-400">
        No products match your filters.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-500">
        Try adjusting the price range or sort options.
      </p>
    </div>
  ) : (
    <div className={`grid gap-6 md:gap-10 ${viewMode === 'grid'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1'}`}>
      {filteredProducts.map((product) => {
        const BASE_URL = 'http://localhost:5000';
        const mainPath = product.images?.[0]?.fileUrl || '';
        const hoverPath = product.images?.[1]?.fileUrl || mainPath;
        const mainImage = mainPath ? `${BASE_URL}${mainPath}` : null;
        const hoverImage = hoverPath ? `${BASE_URL}${hoverPath}` : mainImage;

        return (
          <div
            key={product.productId}
            className={`group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 cursor-pointer ${
              viewMode === 'list' 
                ? 'flex items-center gap-6 h-40 md:h-48'   // ← List view: chhoti height + flex row
                : 'flex flex-col h-96 md:h-[28rem]'       // ← Grid view: badi height
            }`}
            onClick={() => navigate(`/product/${product.productId}`)}
          >
            {/* Image Container */}
            <div className={`relative overflow-hidden ${
              viewMode === 'list' 
                ? 'w-32 h-32 md:w-40 md:h-40 flex-shrink-0'   // List: chhoti image
                : 'w-full h-3/5 md:h-64'                      // Grid: badi image
            }`}>
              {mainImage ? (
                <>
                  <img
                    src={mainImage}
                    alt={product.productName}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      viewMode === 'list' ? 'rounded-l-2xl' : ''
                    }`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x500?text=Image+Error';
                    }}
                  />
                  {hoverImage && hoverImage !== mainImage && (
                    <img
                      src={hoverImage}
                      alt={`${product.productName} alternate`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  <span className="text-base font-medium">No preview</span>
                </div>
              )}

              {/* Gradient Overlay - list view mein optional chhota */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Add to Cart - list view mein right side pe adjust */}
              <div className={`absolute ${viewMode === 'list' ? 'top-3 right-3' : 'top-4 right-4'} opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10`}>
                <button
  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2.5 md:p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300"
  onClick={(e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/auth');          // ← yahan use kiya
    } else {
      navigate('/cart');          // ← yahan use kiya
      // ya future mein: addToCart logic + navigate('/cart')
    }
  }}
>
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
</button>
              </div>
            </div>

            {/* Content */}
            <div className={`p-4 md:p-6 flex flex-col ${viewMode === 'list' ? 'flex-1 justify-center' : ''}`}>
              <h2 className={`font-bold ${viewMode === 'list' ? 'text-lg md:text-xl line-clamp-1' : 'text-xl md:text-2xl line-clamp-2'} mb-1 md:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors`}>
                {product.productName}
              </h2>

              <p className={`text-gray-600 dark:text-gray-400 ${viewMode === 'list' ? 'text-sm line-clamp-1' : 'text-sm md:text-base line-clamp-2'} mb-2 md:mb-4 min-h-[2.5rem] md:min-h-[3rem]`}>
                {product.shortDescription || 'Premium 3D printed creation'}
              </p>

              <div className="flex items-baseline gap-3">
                <span className={`font-bold ${viewMode === 'list' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                  ₹{product.sellingPrice}
                </span>
                {product.mrp && product.mrp > product.sellingPrice && (
                  <span className={`text-sm ${viewMode === 'list' ? 'hidden md:inline' : ''} text-gray-500 dark:text-gray-400 line-through`}>
                    ₹{product.mrp}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>
    </div>
  );
}