// src/pages/CategorySubcategories.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SUBCATEGORY_API = 'http://localhost:5000/api/subcategory/public';
const PRODUCT_API = 'http://localhost:5000/api/product/customer/products';

export default function CategorySubcategories({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const { categorySlug } = useParams();

  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── Auto-scroll for Subcategories ────────────────────────────────
  const subcategoriesRef = useRef(null);
  const autoScrollIntervalSubs = useRef(null);
  const [isUserInteractingSubs, setIsUserInteractingSubs] = useState(false);

  const startAutoScrollSubs = useCallback(() => {
    if (autoScrollIntervalSubs.current) clearInterval(autoScrollIntervalSubs.current);

    autoScrollIntervalSubs.current = setInterval(() => {
      if (!subcategoriesRef.current || isUserInteractingSubs) return;

      const container = subcategoriesRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000);
  }, [isUserInteractingSubs]);

  const stopAutoScrollSubs = useCallback(() => {
    if (autoScrollIntervalSubs.current) {
      clearInterval(autoScrollIntervalSubs.current);
      autoScrollIntervalSubs.current = null;
    }
  }, []);

  useEffect(() => {
    if (!loading && subcategories.length > 0 && !isUserInteractingSubs) {
      startAutoScrollSubs();
    }
    return stopAutoScrollSubs;
  }, [loading, subcategories.length, isUserInteractingSubs, startAutoScrollSubs, stopAutoScrollSubs]);

  useEffect(() => {
    const container = subcategoriesRef.current;
    if (!container) return;

    const handleStart = () => {
      setIsUserInteractingSubs(true);
      stopAutoScrollSubs();
    };

    const handleEnd = () => {
      setTimeout(() => {
        setIsUserInteractingSubs(false);
        if (!loading && subcategories.length > 0) startAutoScrollSubs();
      }, 5000);
    };

    container.addEventListener('mouseenter', handleStart);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('touchstart', handleStart);
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('wheel', handleStart);

    return () => {
      container.removeEventListener('mouseenter', handleStart);
      container.removeEventListener('mouseleave', handleEnd);
      container.removeEventListener('touchstart', handleStart);
      container.removeEventListener('touchend', handleEnd);
      container.removeEventListener('wheel', handleStart);
    };
  }, [loading, subcategories.length, startAutoScrollSubs, stopAutoScrollSubs]);

  // ─── Auto-scroll for Products ─────────────────────────────────────
  const productsRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const [isUserInteractingProducts, setIsUserInteractingProducts] = useState(false);

  const startAutoScrollProducts = useCallback(() => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);

    autoScrollInterval.current = setInterval(() => {
      if (!productsRef.current || isUserInteractingProducts) return;

      const container = productsRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000);
  }, [isUserInteractingProducts]);

  const stopAutoScrollProducts = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0 && !isUserInteractingProducts) {
      startAutoScrollProducts();
    }
    return stopAutoScrollProducts;
  }, [loading, products.length, isUserInteractingProducts, startAutoScrollProducts, stopAutoScrollProducts]);

  useEffect(() => {
    const container = productsRef.current;
    if (!container) return;

    const handleStart = () => {
      setIsUserInteractingProducts(true);
      stopAutoScrollProducts();
    };

    const handleEnd = () => {
      setTimeout(() => {
        setIsUserInteractingProducts(false);
        if (!loading && products.length > 0) startAutoScrollProducts();
      }, 5000);
    };

    container.addEventListener('mouseenter', handleStart);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('touchstart', handleStart);
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('wheel', handleStart);

    return () => {
      container.removeEventListener('mouseenter', handleStart);
      container.removeEventListener('mouseleave', handleEnd);
      container.removeEventListener('touchstart', handleStart);
      container.removeEventListener('touchend', handleEnd);
      container.removeEventListener('wheel', handleStart);
    };
  }, [loading, products.length, startAutoScrollProducts, stopAutoScrollProducts]);

  // ─── Data Fetching ────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Subcategories
        const subRes = await axios.get(SUBCATEGORY_API);
        const allSubs = subRes.data.data || [];

        const categorySubs = allSubs.filter(
          (sub) => sub.category?.categorySlug === categorySlug
        );

        if (categorySubs.length > 0) {
          setSubcategories(categorySubs);
          setCategoryName(categorySubs[0]?.category?.categoryName || categorySlug);
        } else {
          setError('No subcategories found for this category');
        }

        // Products in this category
        const prodRes = await axios.get(PRODUCT_API);
        const allProducts = prodRes.data.data || [];

        const categoryProducts = allProducts.filter(
          (product) =>
            product.category?.categorySlug === categorySlug ||
            String(product.categoryId) === String(categorySubs[0]?.category?.id)
        );

        setProducts(categoryProducts);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  // ─── JSX ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</p>
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
      <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-pink-50/30 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10" />
        <div className="relative max-w-7xl mx-auto z-10">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] font-medium text-indigo-600 dark:text-indigo-400 mb-4">
            Category
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {categoryName}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Discover premium subcategories and products in this collection
          </p>
        </div>
      </section>

      {/* Subcategories Grid – Horizontal Auto-scroll */}
      {subcategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Subcategories</h2>

          <div className="relative">
            <div
              ref={subcategoriesRef}
              className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
              `}</style>

              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${categorySlug}/${sub.slug}`}
                  className="flex-shrink-0 w-64 md:w-72 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 snap-start"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={
                        sub.subCategoryImage
                          ? `http://localhost:5000/uploads/subcategories/${sub.subCategoryImage}`
                          : `https://via.placeholder.com/300?text=${encodeURIComponent(sub.subCategoryName)}`
                      }
                      alt={sub.subCategoryName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/300?text=Image+Error')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg md:text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sub.subCategoryName}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products in this Category – Horizontal Auto-scroll */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Products in {categoryName}
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-medium text-gray-600 dark:text-gray-400">
              No products found in this category yet
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Products may be added to subcategories — check above
            </p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={productsRef}
              className="flex gap-6 md:gap-8 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory scrollbar-hide touch-pan-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
              `}</style>

              {products.map((product) => {
                const mainImage = product.images?.[0]?.fileUrl
                  ? `http://localhost:5000${product.images[0].fileUrl}`
                  : 'https://via.placeholder.com/400?text=Product';

                return (
                  <Link
                    key={product.productId}
                    to={`/product/${product.productSlug || product.productId}`}
                    className="flex-shrink-0 w-72 sm:w-80 md:w-96 group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 snap-start"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={mainImage}
                        alt={product.productName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/400?text=Image+Error')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                        {product.productName}
                      </h3>
                      <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                        ₹{product.sellingPrice?.toLocaleString() || '—'}
                      </p>
                      {product.mrp && product.mrp > product.sellingPrice && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₹{product.mrp.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}