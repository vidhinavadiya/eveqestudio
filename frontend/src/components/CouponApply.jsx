import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

export default function CouponApply() {
  const { cart, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

const handleApply = async (e) => {
  e.preventDefault();

  if (!code.trim()) {
    toast.error('Please enter a coupon code');
    return;
  }

  setLoading(true);

  try {
    await applyCoupon(code.trim().toUpperCase());
    toast.success('Coupon applied!');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to apply coupon');
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  console.log("CART ITEMS:", cart?.items);
}, [cart]);


  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeCoupon();
      toast.success('Coupon removed!');
    } catch (err) {
      toast.error('Failed to remove coupon');
    } finally {
      setLoading(false);
    }
  };

  const isCouponApplied = cart?.couponDiscountAmount > 0;

 return (
  <div className="border rounded-2xl p-4 sm:p-5 bg-gray-50 dark:bg-gray-900 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
        Apply Coupon
      </h3>

      {isCouponApplied && (
        <span className="text-green-600 text-sm font-medium">
          Applied ✓
        </span>
      )}
    </div>

    {/* ✅ Wrap the ternary + freeOptions inside a fragment */}
    <>
      {isCouponApplied ? (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <p className="font-semibold text-green-700 dark:text-green-300">
              Coupon Applied
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              You saved ₹{cart.couponDiscountAmount.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-red-600 font-medium hover:underline text-sm sm:text-base mt-2 sm:mt-0"
          >
            {loading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      ) : (
        <form 
          onSubmit={handleApply} 
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-base w-full"
          />

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}
    </>
  </div>
);
}