// src/pages/Search.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const PRODUCT_API = 'http://localhost:5000/api/product/customer/products';

export default function Search({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(PRODUCT_API);
        let allProducts = res.data.data || [];

        // Agar query hai to filter karo
        if (query) {
          allProducts = allProducts.filter((product) =>
            [
              product.productName,
              product.shortDescription,
              product.category?.categoryName,
              product.subcategory?.subCategoryName,
            ].some((field) => field?.toLowerCase().includes(query.toLowerCase()))
          );
        }

        setProducts(allProducts);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />

      {/* Hero Section – Glassmorphism + Animated Gradient */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl" />

        {/* Glass card effect */}
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="inline-block px-6 py-3 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/50 mb-6">
            <p className="text-sm md:text-base uppercase tracking-[0.3em] font-semibold text-indigo-600 dark:text-indigo-400">
              {query ? 'Search Results' : 'Explore All Products'}
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-700 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            {query ? `"${query}"` : 'All Products'}
          </h1>

          <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
            {query && ` for "${query}"`}
          </p>
        </div>
      </section>

      {/* Results Section – Premium Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-t-transparent border-l-indigo-500 border-r-purple-500 border-b-transparent animate-spin"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-pink-500/10 blur-2xl animate-pulse"></div>
            </div>
            <p className="mt-10 text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {query ? `Searching for "${query}"...` : 'Loading collection...'}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-32 text-red-600 dark:text-red-400 text-2xl font-bold">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <img
      src="https://cdn-icons-png.flaticon.com/512/12635/12635544.png"
      alt="Online shopping search not found"
      className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-8 animate-bounce object-contain"
    />
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              {query ? `No results for "${query}"` : 'No products found'}
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {query
                ? 'Try different keywords, check spelling, or explore categories.'
                : 'Our collection is updating — check back soon!'}
            </p>
            <button
  onClick={() => window.history.back()}
  className="
    px-10 py-5 
    bg-black text-white 
    dark:bg-white dark:text-black 
    font-bold text-lg 
    rounded-2xl 
    shadow-xl 
    hover:shadow-2xl 
    hover:scale-105 
    transition-all duration-300
  "
>
  Go Back
</button>
          </div>
        ) : (
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const BASE_URL = 'http://localhost:5000';
              const mainPath = product.images?.[0]?.fileUrl || '';
              const hoverPath = product.images?.[1]?.fileUrl || mainPath;
              const mainImage = mainPath ? `${BASE_URL}${mainPath}` : null;
              const hoverImage = hoverPath ? `${BASE_URL}${hoverPath}` : mainImage;

              return (
                <div
                  key={product.productId}
                  className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 cursor-pointer"
                  onClick={() => window.location.href = `/product/${product.productId}`}
                >
                  {/* Image Container – Glass hover effect */}
                  <div className="relative h-80 overflow-hidden rounded-t-3xl">
                    {mainImage ? (
                      <>
                        <img
                          src={mainImage}
                          alt={product.productName}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                        <span className="text-xl font-medium">No preview</span>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Quick Add to Cart Button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <button
                        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-4 rounded-full shadow-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Added to cart! (add logic here)');
                        }}
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.productName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-5 min-h-[3rem]">
                      {product.shortDescription || 'Premium 3D printed masterpiece'}
                    </p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        ₹{product.sellingPrice}
                      </span>
                      {product.mrp && product.mrp > product.sellingPrice && (
                        <span className="text-base text-gray-500 dark:text-gray-400 line-through">
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