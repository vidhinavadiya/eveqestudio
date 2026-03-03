import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

export default function BXGYCoupons({ onApplySuccess }) {
  const [bxgyCoupons, setBxgyCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null); 
  const { cart, applyCoupon } = useCart(); 

  useEffect(() => {
    fetchBXGY();
  }, []);

  const fetchBXGY = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bxgy-coupon', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend ab coupons ke saath product details bhi bhej raha hai
      setBxgyCoupons(res.data.coupons || []);
    } catch (err) {
      console.error("BXGY Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isEligible = (coupon) => {
    if (!cart || !cart.items) return false;
    const buyIds = coupon?.buyProductIds || [];
    if (!Array.isArray(buyIds)) return false;

    return cart.items.some(item => 
      buyIds.map(Number).includes(Number(item.productId)) && 
      Number(item.quantity) >= Number(coupon.buyQuantity || 1)
    );
  };

  const handleApplyClick = (coupon) => {
    if (!isEligible(coupon)) {
      toast.error("Pehle required product cart mein add karein!");
      return;
    }
    setSelectedCoupon(coupon);
  };

const confirmSelection = async (pId) => {
  try {
    setLoading(true);
    // 1. Backend call: coupon code aur product ID dono bhej rahe hain
    await applyCoupon(selectedCoupon.code, { selectedFreeProductId: pId });
    
    // 2. Success feedback
    toast.success(`Free product added to cart!`);
    
    // 3. UI Cleanup
    setSelectedCoupon(null); 
    
    // 4. Cart refresh trigger (agar prop pass kiya hai)
    if (onApplySuccess) onApplySuccess(); 
    
  } catch (err) {
    toast.error(err.response?.data?.message || "Coupon apply nahi ho saka");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="text-orange-500 p-2 animate-pulse text-center">Checking Offers...</div>;
  if (!bxgyCoupons || bxgyCoupons.length === 0) return null;

  return (
    <div className="space-y-4">
      {bxgyCoupons.map((coupon) => {
        const eligible = isEligible(coupon);
        return (
          <div key={coupon.id} className={`p-4 border rounded-2xl transition-all ${eligible ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
            <div className="flex justify-between items-center">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${eligible ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
                  {eligible ? 'Offer Available' : 'Not Available'}
                </span>
                <h4 className="text-lg font-bold mt-1">{coupon.code}</h4>
                <p className="text-sm text-gray-600">Buy {coupon.buyQuantity}, Get {coupon.freeQuantity} Free</p>
                <p className="text-[10px] text-gray-400 mt-1">{coupon.description}</p>
              </div>
              
              <button 
                onClick={() => handleApplyClick(coupon)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${eligible ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                disabled={!eligible}
              >
                Apply Offer
              </button>
            </div>
          </div>
        );
      })}

      {/* --- Free Product Selection Modal --- */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2">Select your Free Gift</h3>
            <p className="text-sm text-gray-500 mb-4">Inme se koi ek product free select karein:</p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {/* ✅ Backend se aane wala 'freeProductsData' use kar rahe hain */}
              {selectedCoupon.freeProductsData && selectedCoupon.freeProductsData.length > 0 ? (
                selectedCoupon.freeProductsData.map((product) => (
                  <div 
                    key={product.productId}
                    onClick={() => confirmSelection(product.productId)}
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 cursor-pointer bg-gray-50 transition-all group"
                  >
                    {/* Product Image */}
                    <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-gray-100">
                        {/* ✅ Base URL ke saath image fix */}
<img 
  src={product.productImage 
    ? `http://localhost:5000${product.productImage}` 
    : 'https://via.placeholder.com/150'} 
  className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
  alt={product.productName} 
  // Agar image load na ho toh placeholder dikhaye
  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
/>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{product.productName}</p>
                      <p className="text-[10px] text-green-600 font-bold uppercase">Free Reward</p>
                    </div>
                    
                    <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-xs py-4">No products available</p>
              )}
            </div>
            
            <button 
              onClick={() => setSelectedCoupon(null)}
              className="mt-6 w-full py-3 text-gray-400 hover:text-gray-600 font-semibold text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}