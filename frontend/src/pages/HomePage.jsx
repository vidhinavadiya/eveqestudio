// src/pages/HomePage.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Footer from '../components/Footer';
import Hero1 from '../../src/assets/images/hero1.jpg';
import Hero2 from '../../src/assets/images/hero2.jpg';
import Hero3 from '../../src/assets/images/hero3.jpg';

// Fir array mein unhe use karein
const heroImages = [
  Hero1,
  Hero2,
  Hero3
];


export default function HomePage({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const scrollContainerRef = useRef(null);
  const productsScrollRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const [reviews, setReviews] = useState([]);
const reviewsScrollRef = useRef(null);

 
// Fetch All Reviews
useEffect(() => {
  const fetchReviews = async () => {
    try {
      // Note: Aapka backend endpoint check kar lena, maine example diya hai
      const res = await axios.get('http://localhost:5000/api/reviews/public');
      setReviews(res.data.data || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  };
  fetchReviews();
}, []);

// Reviews Auto-Scroll Logic
useEffect(() => {
  const interval = setInterval(() => {
    if (!reviewsScrollRef.current || isUserInteracting) return;

    const container = reviewsScrollRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScroll - 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: 500, behavior: "smooth" });
    }
  }, 5000);

  return () => clearInterval(interval);
}, [isUserInteracting]);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [currentHero, setCurrentHero] = useState(0);

   const [ratingsMap, setRatingsMap] = useState({});

  useEffect(() => {
  const fetchRatingsForProducts = async () => {
    try {
      const ratingData = {};

      await Promise.all(
        products.map(async (prod) => {
          const res = await axios.get(
            `http://localhost:5000/api/reviews/product/${prod.productId}`
          );

          const reviews = res.data.data || [];

          if (reviews.length > 0) {
            const total = reviews.reduce((sum, r) => sum + r.rating, 0);
            ratingData[prod.productId] = {
              avg: (total / reviews.length).toFixed(1),
              count: reviews.length
            };
          } else {
            ratingData[prod.productId] = {
              avg: 0,
              count: 0
            };
          }
        })
      );

      setRatingsMap(ratingData);
    } catch (err) {
      console.error("Error fetching ratings", err);
    }
  };

  if (products.length > 0) {
    fetchRatingsForProducts();
  }
}, [products]);

  // Hero slider auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category/public');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to load categories.', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/product/customer/products');
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setProductLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Scroll functions
  const scrollCategories = (direction) => {
    if (!scrollContainerRef.current) return;
    const amount = scrollContainerRef.current.clientWidth * 0.85;
    scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Products auto-scroll logic
  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);

    autoScrollIntervalRef.current = setInterval(() => {
      if (!productsScrollRef.current || isUserInteracting) return;

      const container = productsScrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 5000);
  }, [isUserInteracting]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!productLoading && products.length > 0 && !isUserInteracting) {
      startAutoScroll();
    }
    return () => stopAutoScroll();
  }, [productLoading, products.length, isUserInteracting, startAutoScroll, stopAutoScroll]);

  const avgRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
        reviews.length
      ).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="pt-16">
        {/* Hero Slider */}
        <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${idx === currentHero ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80" />

         <div className="relative z-10 w-full px-6 text-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-slow">
              3D Printer Hub
            </h1>
            <p className="mt-6 text-xl md:text-3xl text-gray-200 font-light max-w-4xl mx-auto">
              Unleash Creativity with Next-Gen 3D Printing Technology
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/all-products" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-400">
                Start Exploring
              </Link>
              <Link to="/my-orders" className="px-10 py-5 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 rounded-full transition-all duration-400 hover:scale-105">
                Custom Orders
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentHero ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </section>

{/* Shop by Category */}
<section className="py-8 md:pb-6 bg-white dark:bg-gray-950">
  <div className="max-w-screen-2xl mx-auto px-1 sm:px-2 lg:px-4">
    <div className="text-center mb-6 md:mb-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight uppercase italic">
        Shop By Categories
      </h2>
      <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-4 rounded-full"></div>

      <p className="mt-1.5 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        Discover your favorites
      </p>
    </div>

    <div className="relative">
      <div 
        ref={scrollContainerRef}
        className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto pb-5 pt-1 scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8"
      >
        {categories.map((category) => {
          const imageUrl = category.categoryImage 
            ? `http://localhost:5000/uploads/categories/${category.categoryImage}` 
            : `https://via.placeholder.com/280x350?text=${encodeURIComponent(category.categoryName)}`;

          return (
            <Link
              key={category.id || category.categorySlug}
              to={`/category/${category.categorySlug}`}
              className="flex-shrink-0 w-[100px] xs:w-[110px] sm:w-[130px] md:w-[145px] lg:w-[155px] snap-start group"
            >
              <div className="
                relative rounded-lg overflow-hidden 
                shadow-lg shadow-gray-400/40 dark:shadow-black/50 
                transition-all duration-500 ease-out
                group-hover:shadow-2xl group-hover:shadow-cyan-500/50 dark:group-hover:shadow-cyan-700/60
                group-hover:-translate-y-1 group-hover:scale-[1.03]
                border border-gray-200/80 dark:border-gray-800/70 
                bg-white dark:bg-gray-900
              ">
                {/* Image + strong hover shadow/glow */}
                <div className="aspect-[4/5] relative">
                  <div className="
                    w-full h-full 
                    rounded-lg 
                    overflow-hidden 
                    shadow-xl shadow-gray-400/50 dark:shadow-black/60
                    transition-all duration-500 ease-out
                    group-hover:shadow-2xl group-hover:shadow-cyan-500/50 dark:group-hover:shadow-cyan-700/60
                  ">
                    <img
                      src={imageUrl}
                      alt={category.categoryName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                {/* Category name */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                  <p className="text-white text-[11px] sm:text-xs md:text-sm font-semibold text-center tracking-wide drop-shadow leading-tight">
                    {category.categoryName}
                  </p>
                </div>

                {/* Play icon */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="
                    w-5 h-5 sm:w-6 sm:h-6 
                    rounded-full 
                    bg-white/95 dark:bg-gray-900/95 
                    backdrop-blur-md 
                    flex items-center justify-center 
                    shadow-md 
                    border border-gray-200/60 dark:border-gray-700/70
                  ">
                    <svg 
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-900 dark:text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Scroll buttons */}
      <button
        onClick={() => scrollCategories('left')}
        className="absolute -left-2 sm:-left-3 md:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-full shadow border border-gray-200/70 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition hidden md:flex items-center justify-center z-10"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => scrollCategories('right')}
        className="absolute -right-2 sm:-right-3 md:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-full shadow border border-gray-200/70 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition hidden md:flex items-center justify-center z-10"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</section>
{/* Featured Products */}
<section className="pt-6 md:pt-8 pb-16 md:pb-20 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
  <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
    <div className="text-center mb-10 md:mb-16">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 tracking-tight">
        Featured Products
      </h2>
      <div className="w-28 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 mx-auto mt-5 rounded-full"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
        Discover what's trending right now
      </p>
    </div>

    {productLoading ? (
      <div className="flex justify-center py-24">
        <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    ) : products.length === 0 ? (
      <p className="text-center text-gray-500 py-16">No featured products available</p>
    ) : (
      <div
        className="relative"
        onMouseEnter={() => setIsUserInteracting(true)}
        onMouseLeave={() => setIsUserInteracting(false)}
      >
        <div
          ref={productsScrollRef}
          className="flex gap-5 sm:gap-6 md:gap-8 lg:gap-10 overflow-x-auto pb-10 md:pb-12 pt-2 px-2 md:px-4 scroll-smooth scrollbar-hide snap-x snap-mandatory touch-pan-x"
        >
          {products.map((product, index) => {
            const BASE_URL = 'http://localhost:5000';
            const img = product.images?.[0]?.fileUrl
              ? `${BASE_URL}${product.images[0].fileUrl}`
              : 'https://via.placeholder.com/400?text=Product';
            const hoverImg = product.images?.[1]?.fileUrl
              ? `${BASE_URL}${product.images[1].fileUrl}`
              : img;

            return (
              <Link
                key={product.productId}
                to={`/product/${product.productSlug || product.productId}`}
                className={`
                  flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] 
                  group relative bg-white dark:bg-gray-900/90 
                  rounded-2xl overflow-hidden 
                  border border-gray-100/80 dark:border-gray-800/60
                  shadow-md hover:shadow-2xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-900/30
                  transition-all duration-500 ease-out
                  transform hover:-translate-y-2
                  opacity-0 translate-y-8
                  animate-[fadeInUp_0.7s_ease-out_forwards]
                `}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Image container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  {/* Default image */}
                  <img
                    src={img}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                  />

                  {/* Second image on hover (crossfade style) */}
                  {hoverImg !== img && (
                    <img
                      src={hoverImg}
                      alt={product.productName + " alt"}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Sale badge */}
                  {product.mrp > product.sellingPrice && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-2 z-10">
                      SAVE {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}%
                    </div>
                  )}

                  {/* Add to Cart icon - appears on hover */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Add to cart →", product.productName);
                      // addToCart logic here later
                    }}
                    className="absolute top-3 right-3 z-20 
                      opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                      transition-all duration-300 ease-out
                      bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
                      p-3 rounded-full shadow-lg hover:bg-yellow-400 hover:text-black
                      border border-gray-200/70 dark:border-gray-700
                      transform hover:scale-110 active:scale-95"
                    title="Add to Cart"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col">
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white line-clamp-2 min-h-[2.8rem] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {product.productName}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 min-h-[2.8rem]">
                    {product.shortDescription || "Premium 3D printing filament / accessory"}
                  </p>

                  {/* Price area */}
                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{product.sellingPrice?.toLocaleString()}
                    </span>
                    {product.mrp > product.sellingPrice && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.mrp?.toLocaleString()}
                      </span>
                    )}
                  </div>

<div className="flex items-center gap-2 mt-2">
  <div className="flex text-yellow-400 text-sm">
    {"★".repeat(Math.floor(ratingsMap[product.productId]?.avg || 0))}
    {"☆".repeat(5 - Math.floor(ratingsMap[product.productId]?.avg || 0))}
  </div>

  <span className="text-xs text-gray-500">
    {ratingsMap[product.productId]?.count > 0
      ? `${ratingsMap[product.productId]?.avg} (${ratingsMap[product.productId]?.count})`
      : "No reviews"}
  </span>
</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    )}
  </div>

  {/* Optional scroll hint for mobile */}
  <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 md:hidden">
    ← Swipe to explore more →
  </div>
</section>
{/* Testimonials Section */}
<section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    
    {/* Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
        What Our Customers Are Saying
      </h2>

      <div className="flex justify-center mt-4 text-cyan-500 gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-6 h-6 ${
              i < Math.round(avgRating) ? "text-cyan-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
      </div>

      <p className="mt-2 text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700 inline-block pb-1">
        ⭐ {avgRating} from {reviews.length} reviews
      </p>
    </div>

    {reviews.length === 0 ? (
      <p className="text-center text-gray-500">No reviews yet.</p>
    ) : (
      <div
        className="relative group"
        onMouseEnter={() => setIsUserInteracting(true)}
        onMouseLeave={() => setIsUserInteracting(false)}
      >
        {/* Left Button */}
        <button
          onClick={() =>
            reviewsScrollRef.current?.scrollBy({
              left: -800,
              behavior: "smooth",
            })
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 dark:bg-black/40 rounded-full"
        >
          ◀
        </button>

        {/* Scroll Container */}
        <div
          ref={reviewsScrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-10"
        >
          {reviews.map((review, idx) => {
            
            // SAFE IMAGE LOGIC (MP4 FILTER)
            const validImage = review.product?.images?.find(
              (img) =>
                img.fileUrl &&
                !img.fileUrl.toLowerCase().endsWith(".mp4")
            );

            const pImg = validImage
              ? `http://localhost:5000${validImage.fileUrl}`
              : "https://via.placeholder.com/300x300?text=No+Image";

            const uName =
              review.user?.username ||
              review.userName ||
              "Verified Buyer";

            const rating = Math.max(
              0,
              Math.min(5, Number(review.rating) || 0)
            );

            return (
              <div
                key={idx}
                className="flex-shrink-0 w-full md:w-[800px] flex flex-col md:flex-row items-center gap-8 snap-center bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl"
              >
                {/* User */}
                <div className="w-full md:w-1/4 text-center md:text-right">
                  <h4 className="text-xl font-black italic uppercase">
                    {uName}
                  </h4>

                  <div className="flex justify-center md:justify-end mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating
                            ? "text-cyan-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="w-full md:w-2/4 text-center md:text-left md:pl-8 border-l-0 md:border-l-2 border-gray-200 dark:border-gray-700">
                  <h5 className="font-bold mb-2 italic">
                    {rating >= 4
                      ? "Excellent Quality"
                      : "Verified Review"}
                  </h5>

                  <p className="text-gray-600 dark:text-gray-400 italic">
                    "{review.comment || "Great product!"}"
                  </p>
                </div>

                {/* Product Image */}
                <div className="w-full md:w-1/4">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 aspect-square">
                    <img
                      src={pImg}
                      alt="Reviewed Product"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                      <span className="text-white text-xs font-bold uppercase">
                        {review.product?.productName ||
                          "View Product"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Button */}
        <button
          onClick={() =>
            reviewsScrollRef.current?.scrollBy({
              left: 800,
              behavior: "smooth",
            })
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 dark:bg-black/40 rounded-full"
        >
          ▶
        </button>
      </div>
    )}
  </div>
</section>
      </main>

      <Footer />

      <style jsx="true" global="true">{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}