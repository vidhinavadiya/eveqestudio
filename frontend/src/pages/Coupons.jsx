// src/pages/Coupons.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLock, FiUnlock, FiCopy } from 'react-icons/fi';
import BXGYCoupons from '../components/BXGYCoupons';

export default function CustomerCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/coupon/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allCoupons = res.data.data || [];

        const now = new Date();
        const activeCoupons = allCoupons.filter((coupon) => {
          const isActive = coupon.isActive === true;
          const notExpired = !coupon.expiryDate || new Date(coupon.expiryDate) > now;
          return isActive && notExpired;
        });

        setCoupons(activeCoupons);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load available coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [token]);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isUsageExceeded = (coupon) => {
    if (!coupon.usageLimit) return false;
    return (coupon.usedCount || 0) >= coupon.usageLimit;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-4 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BXGYCoupons />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center sm:text-left">
          Available Coupons
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-10 text-center sm:text-left text-sm sm:text-base">
          Unlock discounts on your next order!
        </p>

        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm sm:text-base">
            {error}
          </div>
        )}

        {coupons.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
              No active coupons available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {coupons.map((coupon) => {
              const expired = isExpired(coupon.expiryDate);
              const usageExceeded = isUsageExceeded(coupon);
              const isDisabled = expired || usageExceeded;

              return (
                <div
                  key={coupon.id}
                  className={`
                    relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md overflow-hidden border
                    ${isDisabled
                      ? 'border-gray-300 dark:border-gray-700 opacity-75'
                      : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                    }
                  `}
                >
                  {/* Top colored bar - thinner on mobile */}
                  <div
                    className={`h-1.5 sm:h-2 ${
                      isDisabled
                        ? 'bg-gray-400'
                        : coupon.discountType === 'percentage'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                        : coupon.discountType === 'flat'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : ''
                    }`}
                  />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-gray-900 dark:text-white break-all">
                        {coupon.code}
                      </h3>

                      <button
                        onClick={() => copyToClipboard(coupon.code, coupon.id)}
                        disabled={isDisabled}
                        className={`text-gray-500 dark:text-gray-400 transition ${
                          !isDisabled ? 'hover:text-indigo-600 dark:hover:text-indigo-400' : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <FiCopy size={20} />
                      </button>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      {isDisabled ? (
                        <>
                          <FiLock className="text-red-500" size={18} />
                          <span className="text-red-600 dark:text-red-400 font-medium text-sm sm:text-base">
                            {expired ? 'Expired' : 'Usage limit reached'}
                          </span>
                        </>
                      ) : (
                        <>
                          <FiUnlock className="text-green-600 dark:text-green-400" size={18} />
                          <span className="text-green-600 dark:text-green-400 font-medium text-sm sm:text-base">
                            Active
                          </span>
                        </>
                      )}
                    </div>

                    {/* Discount - bigger on mobile */}
                    <div className="mb-4">
                      <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {coupon.discountType === 'percentage' && 
                            `${coupon.discountValue}% OFF`}

                          {coupon.discountType === 'flat' && 
                            `₹${coupon.discountValue} OFF`}
                      </p>


                      {coupon.discountType === 'percentage' && coupon.maxDiscountAmount && (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Up to ₹{coupon.maxDiscountAmount}
                        </p>
                      )}
                    </div>

                    {/* Conditions - smaller text on mobile */}
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {coupon.minorderamount && (
                        <p>Min. order: ₹{coupon.minorderamount}</p>
                      )}

                      {coupon.isFirstOrderOnly && (
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                          First order only!
                        </p>
                      )}

                      {typeof coupon.usageLimit === 'number' && (
                        <div className="mt-2">
                          <p>
                            <span className="font-medium">Used:</span> {coupon.usedCount || 0} / {coupon.usageLimit}
                          </p>
                          <p>
                            <span className="font-medium">Remaining:</span>{' '}
                            {Math.max(coupon.usageLimit - (coupon.usedCount || 0), 0)}
                          </p>
                        </div>
                      )}

                      {coupon.expiryDate && (
                        <p>
                          Expires:{' '}
                          {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="border-t border-dashed border-gray-300 dark:border-gray-700 px-5 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">
                    {copiedId === coupon.id ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Copied!</span>
                    ) : isDisabled ? (
                      <span className="text-gray-500 dark:text-gray-400">Not available</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Tap code to copy</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}