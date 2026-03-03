import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CouponApply from '../components/CouponApply';
import Navbar from '../components/Navbar';
import BXGYCoupons from '../components/BXGYCoupons';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Cart({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const { cart, loading, refreshCart, applyCoupon, removeCoupon } = useCart();
  const cartItemCount = cart?.items?.length || 0;

  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);

  const token = localStorage.getItem('token'); 

  const navigate = useNavigate();
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    if (showCouponsModal && token) {
      const fetchCoupons = async () => {
        setCouponsLoading(true);
        try {
          const res = await axios.get('http://localhost:5000/api/coupon/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCoupons(res.data.data || res.data || []);
        } catch (err) {
          toast.error('Failed to load coupons');
        } finally {
          setCouponsLoading(false);
        }
      };
      fetchCoupons();
    }
  }, [showCouponsModal, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Navbar
          isLoggedIn={!!token}
          onLogout={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          cartItemCount={cartItemCount}
        />

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-20 md:pt-24 flex items-center justify-center px-5 sm:px-8 lg:px-12">
          <div className="w-full max-w-3xl text-center animate-fade-in-up">
            <div className="relative inline-block mb-10 md:mb-12">
              <div className="w-40 h-40 md:w-48 md:h-48 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl flex items-center justify-center shadow-2xl rotate-[-8deg] hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/6790/6790474.png" 
                  alt="purchases add to cart icon" 
                  className="w-28 h-28 md:w-32 md:h-32 object-contain"
                />
              </div>

              <div className="absolute -top-6 -left-6 w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center animate-float-1">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/644/644458.png" 
                  alt="iphone" 
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                />
              </div>

              <div className="absolute -bottom-4 -right-8 w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center animate-float-2">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/7615/7615032.png" 
                  alt="music" 
                  className="w-9 h-9 md:w-11 md:h-11 object-contain"
                />
              </div>

              <div className="absolute top-12 -right-10 w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center animate-float-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/9284/9284340.png" 
                  alt="cart" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Your Cart is Empty 
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed">
              Your shopping adventure is waiting! Add some cool stuff to your cart and let's get started.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-10 sm:px-12 py-5 sm:py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform transition-all hover:scale-105 active:scale-95"
            >
              Explore Now →
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isValidCoupon = (coupon) => cart.subtotal >= (coupon.minorderamount || 0);
  const isAppliedCoupon = (couponCode) => cart.appliedCoupon?.code === couponCode;

  const handleApplyFromModal = async (code) => {
    try {
      await applyCoupon(code);
      toast.success('Coupon applied successfully!');
      setShowCouponsModal(false);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to apply coupon';
      toast.error(message);
    }
  };

  const handleRemoveFromModal = async () => {
    try {
      await removeCoupon();
      toast.success('Coupon removed');
    } catch (err) {
      toast.error('Failed to remove coupon');
    }
  };

  const formatExpiry = (date) => {
    if (!date) return 'No expiry';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Navbar
        isLoggedIn={!!token}
        onLogout={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        cartItemCount={cartItemCount}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-20 md:pt-24 pb-16 px-5 sm:px-8 lg:px-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-10 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 animate-fade-in text-center lg:text-left">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="lg:col-span-8 space-y-6">
            {cart.items.map((item, index) => (
              <div
                key={item.id}
                className={`transform transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-xl rounded-2xl overflow-hidden ${
                  index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'
                }`}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 sticky top-20 md:top-24 space-y-6 sm:space-y-8 transition-all duration-300 hover:shadow-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Order Summary</h2>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Add ₹{Math.max(0, 250 - cart.subtotal).toFixed(0)} more for{' '}
                  <span className="text-green-600 dark:text-green-400">Flat 20% OFF</span>
                </p>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((cart.subtotal / 250) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base">
                <div className="flex justify-between">
                  <span className="dark:text-gray-300">Subtotal (MRP)</span>
                  <span className="dark:text-white font-medium">₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Product Discount</span>
                  <span>-₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-300">Coupon Savings</span>
                  <span className="text-green-600 dark:text-green-400">
                    {cart.couponDiscountAmount > 0 ? `-₹${cart.couponDiscountAmount.toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-300">Shipping</span>
                  <span className={cart.shippingCharge === 0 ? 'text-green-600 dark:text-green-400' : 'dark:text-white'}>
                    {cart.shippingCharge === 0 ? 'FREE' : `₹${cart.shippingCharge}`}
                  </span>
                </div>
                <div className="pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <CouponApply />

              <button
                onClick={() => setShowCouponsModal(true)}
                className="w-full text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200 mt-2"
              >
                See all available coupons →
              </button>

              {loading ? (
  <div className="flex justify-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
  </div>
) : (
  <button
  onClick={() => navigate('/checkout', { state: { cart } })} // cart pass kar diya
  disabled={cart.items.length === 0}
  className="w-full py-5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-lg sm:text-xl rounded-2xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
>
  PROCEED TO CHECKOUT
</button>
)}
            </div>
          </div>
        </div>
      </div>

      {showCouponsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 scale-100">
            <div className="p-6 sm:p-8 relative">
              <button
                onClick={() => setShowCouponsModal(false)}
                className="absolute top-5 sm:top-6 right-6 sm:right-8 text-4xl sm:text-5xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                ×
              </button>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">
                Available Coupons
              </h2>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Special Buy 1 Get 1 Offers
                  </h3>
                  <BXGYCoupons onApplySuccess={() => {
                    setShowCouponsModal(false);
                    refreshCart();
                  }} />
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Discount Coupons</h3>
              
                {couponsLoading ? (
                  <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div></div>
                ) : coupons.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No active coupons right now.</p>
                ) : (
                  <div className="space-y-4 pr-2">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          coupon.isActive && isValidCoupon(coupon)
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                            : 'border-gray-200 bg-gray-50 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                          <div>
                            <div className="font-bold text-xl text-indigo-700 dark:text-indigo-300">{coupon.code}</div>
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Min. order: ₹{coupon.minorderamount || 0}
                              </div>
                              {/* Neeche wali line add karein */}
                              <div className="text-[10px] text-gray-400">
                                Valid till: {formatExpiry(coupon.expiryDate)}
                              </div>
                          </div>

                          {coupon.isActive && isValidCoupon(coupon) ? (
                            isAppliedCoupon(coupon.code) ? (
                              <button onClick={handleRemoveFromModal} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl">Remove</button>
                            ) : (
                              <button onClick={() => handleApplyFromModal(coupon.code)} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-xl">Apply</button>
                            )
                          ) : (
                            <span className="text-gray-400 font-medium">Locked 🔒</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowCouponsModal(false)}
                  className="px-10 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}