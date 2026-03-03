import React, { useState, useEffect, useRef } from 'react';
import { useParams,useNavigate, Link  } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import ReviewSection from "../components/ReviewSection";
import ProductFaqSection from "../components/ProductFaqSection";
import { toast } from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';

const ProductViewCount = () => {
  const [viewCount, setViewCount] = useState(() => {
    // Shuru mein random 68-120 ke beech
    return Math.floor(Math.random() * (120 - 68 + 1)) + 68;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount((prev) => {
          const change = Math.random() < 0.75 ? 1 : Math.random() < 0.9 ? 2 : 3; // kabhi-kabhi +3 bhi de do
          const direction = Math.random() < 0.48 ? -1 : 1; // thoda zyada upar jaane ka chance

          let next = prev + change * direction;

          // Thoda aur realistic clamp
          if (next < 62)  next = 62 + Math.floor(Math.random() * 4);   // 62–65 tak bounce
          if (next > 500) next = 500 - Math.floor(Math.random() * 6);   // 494–500 tak

          // Kabhi-kabhi sudden chhota jump (jaise koi ne page khola)
          if (Math.random() < 0.04) {           // ~ har 25 update mein ek baar
            next += Math.random() < 0.5 ? 4 : 5;
          }

          return next;
        });
    }, 1000 + Math.random() * 600); // 1000–1600 ms random → natural lagega

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      {viewCount} customers are viewing this product
    </p>
  );
};

const PRODUCT_DETAIL_API = 'http://localhost:5000/api/product/customer';
const BASE_URL = 'http://localhost:5000';

const ProductGallery = ({ images, product, BASE_URL, selectedImage, setSelectedImage }) => {
  const scrollRef = useRef(null);

  // Sirf scrollToImage rakha (dots aur click ke liye)
  const scrollToImage = (idx) => {
    setSelectedImage(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * idx,
        behavior: 'smooth',
      });
    }
  };


  
  return (
    <div className="lg:sticky lg:top-28 h-fit px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-4 lg:gap-6">
        {/* THUMBNAILS - Desktop pe left side vertical column (baju mein) */}
        {images.length > 0 && (
          <div className="hidden lg:flex flex-col gap-3 lg:gap-4">
            {images.map((media, idx) => (
              <button
                key={media?.id || idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                  selectedImage === idx
                    ? 'border-indigo-500 scale-105 shadow-md'
                    : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-indigo-400'
                } w-20 h-20 lg:w-24 lg:h-24`}
              >
                {media?.fileType === 'video' ? (
                  <video
                    src={`${BASE_URL}${media?.fileUrl || ''}`}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={`${BASE_URL}${media?.fileUrl || ''}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {media?.fileType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold">
                    VIDEO
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* MAIN IMAGE + Mobile Thumbnails */}
        <div className="flex flex-col gap-4">
          {/* MAIN IMAGE */}
          <div className="bg-black rounded-xl overflow-hidden">
            {images[selectedImage]?.fileType !== 'video' ? (
              <img
                src={`${BASE_URL}${images[selectedImage]?.fileUrl || ''}`}
                alt={product.productName}
                className="w-full h-auto max-h-[500px] lg:max-h-[650px] object-contain mx-auto"
              />
            ) : (
              <video
                src={`${BASE_URL}${images[selectedImage]?.fileUrl || ''}`}
                controls
                className="w-full h-auto max-h-[500px] lg:max-h-[650px] object-contain mx-auto"
              />
            )}
          </div>

          {/* MOBILE-ONLY: Horizontal thumbnails at bottom */}
          {images.length > 0 && (
            <div className="lg:hidden overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
              <div className="flex gap-3 min-w-max">
                {images.map((media, idx) => (
                  <button
                    key={media?.id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                      selectedImage === idx
                        ? 'border-indigo-500 scale-105 shadow-md'
                        : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-indigo-400'
                    } w-20 h-20`}
                  >
                    {media?.fileType === 'video' ? (
                      <video
                        src={`${BASE_URL}${media?.fileUrl || ''}`}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={`${BASE_URL}${media?.fileUrl || ''}`}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {media?.fileType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold">
                        VIDEO
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dots indicator (mobile only) */}
      <div className="flex justify-center gap-2 mt-4 lg:hidden">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToImage(idx)}
            className={`transition-all duration-300 rounded-full ${
              selectedImage === idx ? 'w-6 h-2 bg-indigo-600' : 'w-2 h-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function ProductDetail({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate(); // ← Yeh line add ki
  const { addToCart } = useCart();  // ← hook yahan call karo (component ke top pe)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  // Selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Custom fields
  const [customValues, setCustomValues] = useState({});
   const [relatedProducts, setRelatedProducts] = useState([]);

   // 1. Pehle do nayi states add karein top pe
const [reviews, setReviews] = useState([]);
const [avgRating, setAvgRating] = useState(0);
// 2. Reviews fetch karne ke liye ek useEffect add karein
useEffect(() => {
  if (!id) return;
  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/reviews/product/${id}`);
      const reviewData = res.data.data || [];
      setReviews(reviewData);

      if (reviewData.length > 0) {
        const total = reviewData.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating((total / reviewData.length).toFixed(1));
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.error("Error fetching ratings", err);
    }
  };
  fetchRatings();
}, [id]);

  // Fetch related products whenever product._id is available
useEffect(() => {
  if (!product?.productId) return;

  const fetchRelated = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/product/related/${product.productId}`
      );
      console.log("Related products:", res.data.data);
      setRelatedProducts(res.data.data || []);
    } catch (err) {
      console.error(
        "Failed to load related products",
        err.response?.data || err.message
      );
    }
  };

  fetchRelated();
}, [product?.productId]);

  const [coupons, setCoupons] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // ← Yeh line add ki
  // Fake viewing count (real backend se aayega to replace kar dena)
  const calculateTotalPrice = () => {
    let total = (product.sellingPrice || 0) * quantity;
    if (selectedLetter && selectedLetter.price) {
      total += Number(selectedLetter.price);
    }
    return total.toFixed(0);
  };

  // Fetch coupons on page load
  useEffect(() => {
    const fetchCoupons = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/coupon/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allCoupons = res.data.data || [];
        const now = new Date();
        const active = allCoupons.filter(c => 
          c.isActive && (!c.expiryDate || new Date(c.expiryDate) > now)
        );

        setCoupons(active);
      } catch (err) {
        console.error('Failed to fetch coupons', err);
      }
    };

    fetchCoupons();
  }, []);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${PRODUCT_DETAIL_API}/${id}`);
        setProduct(res.data.data);

        // Defaults
        if (res.data.data.colors?.length > 0) {
          const firstActive = res.data.data.colors.find(c => c.isActive);
          if (firstActive) setSelectedColor(firstActive);
        }
        if (res.data.data.sizes?.length > 0) {
          const firstActive = res.data.data.sizes.find(s => s.isActive);
          if (firstActive) setSelectedSize(firstActive);
        }
        if (res.data.data.letters?.length > 0) {
          const firstActive = res.data.data.letters.find(l => l.isActive);
          if (firstActive) setSelectedLetter(firstActive);
        }

        // Init custom values
        const initialCustom = {};
        res.data.data.customizationGroups?.forEach(group => {
          group.fields?.forEach(field => {
            initialCustom[`${group.groupName}-${field.label}`] = '';
          });
        });
        setCustomValues(initialCustom);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

const handleAddToCart = async () => {
    if (product.stockQuantity <= 0) return;

    // Validation
    if (product.colors?.length > 0 && !selectedColor) {
      alert('Please select a color!');
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      alert('Please select a size!');
      return;
    }
    if (product.letters?.length > 0 && !selectedLetter) {
      alert('Please select a letter!');
      return;
    }

    let validCustom = true;
    product.customizationGroups?.forEach(group => {
      group.fields?.forEach(field => {
        if (field.isRequired) {
          const key = `${group.groupName}-${field.label}`;
          if (!customValues[key] || customValues[key].trim() === '') {
            alert(`Please fill required field: ${field.label}`);
            validCustom = false;
          }
        }
      });
    });

    if (!validCustom) return;

    // Payload for backend
    const payload = {
      productId: product._id || product.id || product.productId,
      quantity,
      selectedColor: selectedColor?.colorName || null,
      selectedSize: selectedSize?.sizeName || null,
      selectedLetters: selectedLetter?.letter || null,
      customizationPrice: selectedLetter?.price || 0,
      customizations: Object.entries(customValues)
        .map(([key, value]) => {
          const [groupName, fieldLabel] = key.split('-');
          return { groupName, fieldLabel, userValue: value };
        })
        .filter(c => c.userValue && c.userValue.trim() !== ''),
    };

    try {
      await addToCart(payload);
      navigate('/cart');
    } catch (err) {
      alert('Failed to add to cart. Please try again.');
    }
  };

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
          Loading Product...
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
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error || 'Product not found'}</div>;

  const images = product.images || [];
// const mainImages = images.filter(img => img?.fileType !== 'video') || [];
// const videos = images.filter(img => img?.fileType === 'video') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black text-gray-900 dark:text-gray-100">
      <Navbar 
              isLoggedIn={isLoggedIn} 
              onLogout={onLogout} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode} 
            />

      <main className="w-full px-0 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="texttext-sm px-6 mb-8">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to={`/category/${product.category?.categorySlug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{product.category?.categoryName}</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="font-medium text-gray-900 dark:text-white">{product.productName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
{/* Gallery - yahan ProductGallery component use karo */}
          <ProductGallery
            images={images}
            product={product}
            BASE_URL={BASE_URL}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          {/* Product Info */}
          <div className="p-6 lg:p-12 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{product.productName}</h1>
              {product.productTitle && <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">{product.productTitle}</p>}

              {/* 5 Star Rating Line */}
              {/* 5 Star Rating Line - Dynamic */}
<div className="flex items-center gap-2 mt-3">
  <div className="flex text-yellow-400">
    {/* Full Stars */}
    {"★".repeat(Math.floor(avgRating))}
    {/* Empty Stars */}
    {"☆".repeat(5 - Math.floor(avgRating))}
  </div>
  <span className="text-gray-600 dark:text-gray-400 text-sm">
    {avgRating} ({reviews.length} customer reviews)
  </span>
</div>

              {/* Viewing count */}
            <div>
              <ProductViewCount />
            </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label className="block text-lg font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300">-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-xl font-bold border rounded py-2 bg-white dark:bg-gray-800"
                  min="1"
                  max={product.stockQuantity}
                />
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300">+</button>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">₹{product.sellingPrice}</span>
              {product.mrp && product.mrp > product.sellingPrice && (
                <>
                  <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">₹{product.mrp}</span>
                  <span className="text-lg font-medium text-green-600 dark:text-green-400">
                    {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Taxes & Shipping Note */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Taxes included. Shipping calculated at checkout.
            </p>


               <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
             <button
    onClick={handleAddToCart}
    disabled={product.stockQuantity <= 0}
    className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all ${
      product.stockQuantity > 0 
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl' 
        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`}
  >
    {product.stockQuantity > 0 
      ? `Add to Cart • ₹${calculateTotalPrice()}` 
      : 'Out of Stock'}
  </button>

              <button className="flex-1 py-4 px-8 rounded-xl font-bold text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Buy Now
              </button>
            </div>
{/* Related Products Horizontal Scroll Section */}
{relatedProducts.length > 0 && (
  <div className="related-products mt-10">
    <h2 className="text-xl font-semibold mb-4 dark:text-white">Frequently Bought Together</h2>
    
    {/* Horizontal Scroll Container */}
    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-hide">
      {relatedProducts.map((item) => (
        <div
          key={item.productId}
          className="flex-none w-80 flex items-center justify-between border rounded-lg p-2 
                     bg-white border-gray-200 text-black 
                     dark:bg-zinc-900 dark:border-zinc-700 dark:text-white 
                     shadow-sm hover:shadow-md transition"
        >
          {/* Left: Image and Info */}
          <div className="flex items-center gap-3">
            {/* Small Product Image */}
            <img
              src={item.images?.[0]?.fileUrl ? `${BASE_URL}${item.images[0].fileUrl}` : "/placeholder.png"}
              alt={item.productName}
              className="w-16 h-12 object-cover rounded-md cursor-pointer flex-shrink-0"
              onClick={() => navigate(`/product/${item.productId}`)}
            />
            
            {/* Name and Price */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-medium truncate w-32 leading-tight">
                {item.productName}
              </h3>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                ₹{item.sellingPrice}
              </p>
            </div>
          </div>

          {/* Right: Black Add Button */}
          <button
            onClick={async () => {
              try {
                await addToCart({
                  productId: item._id || item.productId,
                  quantity: 1,
                  selectedColor: item.colors?.[0]?.colorName || null,
                  selectedSize: null,
                  selectedLetters: item.letters?.[0]?.letter || null,
                  customizationPrice: item.letters?.[0]?.price || 0,
                  customizations: []
                });
                toast.success(`${item.productName} added to cart!`);
                navigate('/cart');
              } catch (err) {
                toast.error("Failed to add to cart");
              }
            }}
            className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-800 transition dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <span className="text-lg leading-none">+</span> Add
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{relatedProducts.length === 0 && (
  <p className="mt-4 text-gray-500">No related products found.</p>
)}
        {/* Stock */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              product.stockQuantity > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
            </div>
            {/* NEW: Active Offers Section (Pilgrim style) */}
 {/* Active Offers Section - Pilgrim style with proper validation */}
{coupons.length > 0 && (
  <div className="mt-6 mb-6 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 lg:p-5 border border-blue-200/70 dark:border-blue-800/50 shadow-md">
    <h3 className="text-lg lg:text-xl font-extrabold text-blue-800 dark:text-blue-300 mb-3 tracking-tight">
      Active Offers
    </h3>

    <div className="overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-3 md:gap-4 min-w-max">
        {coupons.map((coupon) => {
          const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
          const isUsageExceeded = coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit;
          const isDisabled = isExpired || isUsageExceeded;

          return (
            <div
              key={coupon.id}
              className={`min-w-[220px] sm:min-w-[240px] p-3.5 rounded-lg border transition-all duration-300 ${
                isDisabled 
                  ? 'bg-gray-100/70 dark:bg-gray-800/70 opacity-70 border-gray-300 dark:border-gray-700 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-900 border-blue-300 dark:border-blue-600 shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer'
              }`}
            >
              {/* Discount & Title */}
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}% OFF` 
                      : `₹${coupon.discountValue} OFF`}
                  </p>
                  {coupon.maxDiscountAmount && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      Up to ₹{coupon.maxDiscountAmount}
                    </p>
                  )}
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isDisabled 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                }`}>
                  {isDisabled ? (isExpired ? 'Expired' : 'Limit') : 'Active'}
                </span>
              </div>

              {/* Coupon Code + Copy */}
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg">
                <code className="font-mono text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                  {coupon.code}
                </code>

                <button
                  onClick={() => !isDisabled && copyToClipboard(coupon.code, coupon.id)}
                  disabled={isDisabled}
                  className={`transition ${
                    isDisabled 
                      ? 'text-gray-400 cursor-not-allowed opacity-50' 
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-800'
                  }`}
                >
                  {copiedId === coupon.id ? (
                    <span className="text-green-600 text-xs font-medium">Copied!</span>
                  ) : (
                    <FiCopy size={16} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
            {/* Shipping Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Shipping</strong><br />
                Maximum Delivery timeline for the product to be delivered is <strong>10 days</strong> excluding weekends and public holidays.
              </p>
            </div>


            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-6">Select Color *</h3>

                <div className="flex flex-wrap gap-4 sm:gap-5">
                  {product.colors
                    .filter(c => c.isActive)
                    .map((color, idx) => {
                      const isSelected = selectedColor?.colorCode === color.colorCode;
                      const selectedBg = isSelected ? `${color.colorCode}CC` : color.colorCode;

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(color)}
                          title={color.colorName}
                          className={`group relative transition-all duration-300 flex-shrink-0 ${isSelected ? 'scale-105 z-10' : 'hover:scale-105'}`}
                        >
                          <div
                            className={`
                              relative px-5 py-3.5 min-w-[100px] sm:min-w-[110px] md:min-w-[120px]
                              rounded-full flex items-center justify-center
                              font-bold text-center text-white text-sm sm:text-base
                              shadow-md cursor-pointer overflow-hidden
                              transition-all duration-300
                              border-2
                              ${isSelected 
                                ? 'border-white shadow-xl ring-2 ring-offset-2 ring-indigo-500/60 dark:ring-indigo-500/70' 
                                : 'border-transparent group-hover:border-gray-400 dark:group-hover:border-gray-500'
                              }
                            `}
                            style={{
                              backgroundColor: selectedBg || '#000000',
                              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                            }}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 bg-black/25 dark:bg-white/15 rounded-full pointer-events-none" />
                            )}
                            <span className="relative z-10 uppercase tracking-wide font-semibold">
                              {color.colorName}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>

                {selectedColor && (
                  <p className="mt-6 text-center text-lg text-gray-700 dark:text-gray-300">
                    Selected Color: 
                    <span className="font-bold ml-2 uppercase" style={{ color: selectedColor.colorCode }}>
                      {selectedColor.colorName}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Select Size *</h3>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.filter(s => s.isActive).map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 border-2 rounded-lg font-medium transition-all ${
                        selectedSize?.sizeName === size.sizeName 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 shadow-md' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:shadow-sm'
                      }`}
                    >
                      {size.sizeName} {size.sizeValue && `(${size.sizeValue})`}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <p className="mt-5 text-center text-lg text-gray-700 dark:text-gray-300">
                    Selected Size: 
                    <span className="font-bold ml-2">
                      {selectedSize.sizeName}
                      {selectedSize.sizeValue && ` (${selectedSize.sizeValue})`}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Letters */}
            {product.letters?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Select Letter *</h3>

                <div className="overflow-hidden">
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2.5 md:gap-3">
                    {product.letters.filter(l => l.isActive).map((letter, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedLetter(letter)}
                        className={`
                          aspect-square w-full max-w-[55px] sm:max-w-[65px] md:max-w-[75px]
                          border-2 rounded-lg flex items-center justify-center
                          transition-all duration-200 cursor-pointer
                          ${selectedLetter?.letter === letter.letter 
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md scale-105' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:shadow-sm'
                          }
                        `}
                      >
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">
                          {letter.letter}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedLetter && (
                  <p className="mt-5 text-center text-lg text-gray-700 dark:text-gray-300">
                    Style: <span className="font-bold uppercase ml-1">{selectedLetter.letter}</span>
                    <span className="ml-3 font-medium text-gray-600 dark:text-gray-400">
                      (₹{selectedLetter.price || 0})
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Customization Groups */}
            {product.customizationGroups?.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Customize Your Product</h3>
                <div className="space-y-10">
                  {product.customizationGroups.map((group, gIdx) => (
                    <div key={gIdx} className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xl font-semibold mb-6">{group.groupName}</h4>
                      <div className="space-y-8">
                        {group.fields.map((field, fIdx) => {
                          const key = `${group.groupName}-${field.label}`;

                          return (
                            <div key={fIdx} className="space-y-2">
                              <label className="block text-sm font-medium">
                                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                              </label>

                              {field.fieldType === 'text' && (
                                <textarea
                                  value={customValues[key] || ''}
                                  onChange={e => setCustomValues(prev => ({ ...prev, [key]: e.target.value }))}
                                  placeholder={field.allowedValues ? `e.g. ${field.allowedValues.split(',')[0]}` : 'Enter text here...'}
                                  rows={1}
                                  maxLength={field.maxLength || 500}
                                  required={field.isRequired}
                                  className="
                                    w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-white dark:bg-gray-800 
                                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                    resize-y min-h-[44px] text-base leading-tight
                                  "
                                />
                              )}

                              {field.fieldType === 'number' && (
                                <input
                                  type="number"
                                  value={customValues[key] || ''}
                                  onChange={e => setCustomValues(prev => ({ ...prev, [key]: e.target.value }))}
                                  min={field.minLength || 0}
                                  max={field.maxLength || undefined}
                                  required={field.isRequired}
                                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                                />
                              )}

                              {field.fieldType === 'dropdown' && (
                                <select
                                  value={customValues[key] || ''}
                                  onChange={e => setCustomValues(prev => ({ ...prev, [key]: e.target.value }))}
                                  required={field.isRequired}
                                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="">Select option</option>
                                  {field.allowedValues?.split(',').map(opt => (
                                    <option key={opt.trim()} value={opt.trim()}>
                                      {opt.trim()}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {field.fieldType === 'checkbox' && (
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={customValues[key] || false}
                                    onChange={e => setCustomValues(prev => ({ ...prev, [key]: e.target.checked }))}
                                    required={field.isRequired}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                  />
                                  <span className="text-sm">{field.label}</span>
                                </label>
                              )}

                              {field.fieldType === 'text' && field.maxLength && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                                  {customValues[key]?.length || 0} / {field.maxLength} characters
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            {/* Short Description */}
            {product.shortDescription && <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{product.shortDescription}</p>}

            {/* Key Points */}
            {product.keyPoints?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-indigo-500 dark:text-indigo-400 text-xl">•</span>
                      <span>{point.pointText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white/50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              {[
                { label: 'Material', value: product.material },
                { label: 'Dimensions', value: product.length && product.width && product.height ? `${product.length} × ${product.width} × ${product.height} cm` : '' },
                { label: 'Weight', value: product.weight ? `${product.weight} g` : '' },
                { label: 'Printing Time', value: product.printingTime },
                { label: 'Manufacturer', value: product.manufacturerName },
                { label: 'Country of Origin', value: product.countryOfOrigin },
                { label: 'Net Quantity', value: product.netQuantity },
              ].filter(item => item.value).map((item, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              ))}
            </div>
            {/* Actions */}
            {/* <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
             <button
    onClick={handleAddToCart}
    disabled={product.stockQuantity <= 0}
    className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all ${
      product.stockQuantity > 0 
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl' 
        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`}
  >
    {product.stockQuantity > 0 
      ? `Add to Cart • ₹${calculateTotalPrice()}` 
      : 'Out of Stock'}
  </button>

              <button className="flex-1 py-4 px-8 rounded-xl font-bold text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Buy Now
              </button>
            </div> */}

            {/* Shipping Info (above actions) */}
            {/* <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Shipping</strong><br />
                Maximum Delivery timeline for the product to be delivered is <strong>10 days</strong> excluding weekends and public holidays.
              </p>
            </div> */}
          </div>
        </div>

        {/* Full Description */}
        {product.productDescription && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Product Description</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {product.productDescription.split('\n').map((para, idx) => <p key={idx} className="mb-4">{para}</p>)}
            </div>
          </div>
        )}

        <ReviewSection product={product} />
{/* Related Products Section */}
<section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
    Related Products
  </h2>

  {/* ← yeh div important hai → */}
  <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-2 px-2">
    <div 
      className="
        inline-flex 
        flex-row 
        gap-6 
        pb-4               /* thoda space niche scrollbar ke liye (jo hide rahega) */
      "
    >
      {relatedProducts
        .filter((p) => p.category === product.category?.categoryName && p.productId !== product.productId)
        .map((product) => {
          const BASE_URL = 'http://localhost:5000';
          const mainImage = product.images?.[0]?.fileUrl
            ? `${BASE_URL}${product.images[0].fileUrl}`
            : 'https://via.placeholder.com/400';
          const hoverImage = product.images?.[1]?.fileUrl
            ? `${BASE_URL}${product.images[1].fileUrl}`
            : mainImage;

          return (
            <div
              key={product.productId}
              className={`
                group relative cursor-pointer transition-all duration-500 
                flex flex-col 
                bg-white dark:bg-gray-900 
                rounded-2xl overflow-hidden 
                shadow-lg hover:shadow-2xl
                min-w-[280px]     /* ← card ki minimum width */
                sm:min-w-[320px]  /* optional: mobile pe thoda bada */
                snap-start
              `}
              onClick={() => navigate(`/product/${product.productSlug || product.productId}`)}
            >
              {/* Image */}
              <div className="w-full h-64 relative">
                <img
                  src={mainImage}
                  alt={product.productName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {hoverImage !== mainImage && (
                  <img
                    src={hoverImage}
                    alt={`${product.productName} alternate`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-bold text-lg md:text-xl mb-1 line-clamp-2 group-hover:text-cyan-500">
                  {product.productName}
                </h2>

                {product.productTitle && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.productTitle}</p>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-xl md:text-2xl">₹{product.sellingPrice}</span>
                  {product.mrp && product.mrp > product.sellingPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-black tracking-widest text-[9px] mt-auto">
                  <span className="text-green-500">In stock</span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  <span className="text-cyan-500">Premium</span>
                </div>

                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="
                    text-[10px] sm:text-xs 
                    font-black 
                    tracking-[0.25em] 
                    text-cyan-600 dark:text-cyan-400 
                    border-b-2 border-cyan-500/70 
                    pb-0.5 
                    transition-all duration-300 
                    hover:text-cyan-700 dark:hover:text-cyan-300 
                    hover:border-cyan-600 dark:hover:border-cyan-400
                    hover:tracking-[0.28em]
                  ">
                    View details
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </div>
</section>
        <ProductFaqSection darkMode={darkMode} />

      </main>
            <Footer />
    </div>
  );
}
