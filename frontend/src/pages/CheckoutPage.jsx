import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';


export default function Checkout({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || {};

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '', 
    city: '',
    state: '', 
    country: 'India',
    pincode: '',
    paymentMethod: 'prepaid'
  });

  if (!cart) {
    navigate('/cart');
    return null;
  }

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const initPayment = (orderData, razorpayOrder) => {
  const options = {
    key: "rzp_test_SJutOauaWN3oR5", // Apni rzp_test_... wali key yahan dalein
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    name: "3D Printer Store",
    description: "Order Payment",
    order_id: razorpayOrder.id,
    handler: async (response) => {
      try {
        const verifyRes = await axios.post('http://localhost:5000/api/order/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: orderData.orderId // Backend 'orderId' bhej raha hai data object mein
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

if (verifyRes.data.success) {
      setPlacedOrderDetails(verifyRes.data.data);
      setShowSuccessModal(true);
      toast.success("Payment Successful!");
    }
  } catch (err) {
    console.error("Verification Error:", err);
    toast.error("Payment Verification Failed");
    navigate('/my-orders');
  }
    },
    prefill: {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      contact: formData.phone
    },
    theme: { color: "#4F46E5" }
  };
  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', function (response) {
    setLoading(false);
    toast.error("Payment failed. Please try again from your orders.");
    alert("Payment Failed: " + response.error.description);
  });
  rzp.open();
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/order/checkout', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.success) {
      if (formData.paymentMethod === 'prepaid') {
        // Backend 'data' object ke andar 'razorpayOrder' bhej raha hai
        initPayment(res.data.data, res.data.data.razorpayOrder);
      } else {
        setPlacedOrderDetails(res.data.data);
        setShowSuccessModal(true);
        toast.success("Order Placed Successfully!");
      }
    }
  } catch (err) {
    console.error("Error details:", err.response?.data);
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={onLogout} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Full Detailed Form */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white">Shipping Information</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Fields */}
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">First Name</label>
              <input type="text" name="firstName" placeholder="John" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            {/* Contact Fields */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-gray-300 ml-1">Email Address</label>
                <input type="email" name="email" placeholder="john@example.com" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-gray-300 ml-1">Phone Number</label>
                <input type="text" name="phone" placeholder="9876543210" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
            </div>

            {/* Address Fields */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">Flat, House no., Building, Company, Apartment</label>
              <input type="text" name="addressLine1" placeholder="Address Line 1" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">Area, Colony, Street, Sector, Village</label>
              <input type="text" name="addressLine2" placeholder="Address Line 2 (Optional)" onChange={handleInput} className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">Landmark</label>
              <input type="text" name="landmark" placeholder="e.g. Near Apollo Hospital" onChange={handleInput} className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">Town/City</label>
              <input type="text" name="city" placeholder="Surat" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">State</label>
              <input type="text" name="state" placeholder="Gujarat" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300 ml-1">Pincode</label>
              <input type="text" name="pincode" placeholder="395001" onChange={handleInput} required className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>

            {/* Payment Method Section */}
            <div className="md:col-span-2 mt-6 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
              <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                Payment Method
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" name="paymentMethod" value="prepaid" checked={formData.paymentMethod === 'prepaid'} onChange={handleInput} className="w-5 h-5 appearance-none border-2 border-indigo-400 rounded-full checked:border-indigo-600 transition-all" />
                    {formData.paymentMethod === 'prepaid' && <div className="absolute w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">Online Payment (Cards/UPI)</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInput} className="w-5 h-5 appearance-none border-2 border-gray-400 rounded-full checked:border-amber-600 transition-all" />
                    {formData.paymentMethod === 'cod' && <div className="absolute w-2.5 h-2.5 bg-amber-600 rounded-full"></div>}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 transition-colors">Cash on Delivery (₹30 Extra)</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="md:col-span-2 mt-4 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform transition active:scale-95 disabled:opacity-50">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white animate-spin rounded-full"></div>
                  PROCESSING...
                </div>
              ) : 'COMPLETE PURCHASE'}
            </button>
          </form>
        </div>

        {/* Right Side: Sticky Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-100 dark:bg-gray-900/50 p-8 rounded-3xl h-fit sticky top-24 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Order Summary</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={`http://localhost:5000/${item.productImage}`} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{item.productName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold dark:text-gray-200">₹{item.total}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{cart.shippingCharge > 0 ? `₹${cart.shippingCharge}` : 'FREE'}</span>
              </div>
              {formData.paymentMethod === 'cod' && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>COD Charge</span>
                  <span>+₹30.00</span>
                </div>
              )}
              {cart.couponDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{cart.couponDiscountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-2xl pt-4 text-gray-900 dark:text-white border-t border-dashed border-gray-300 dark:border-gray-700">
                <span>Total</span>
                <span>₹{(
                  parseFloat(cart.totalAmount) + 
                  (formData.paymentMethod === 'cod' ? 30 : 0)
                ).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
{/* Success Modal */}
{showSuccessModal && (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[40px] p-8 text-center shadow-2xl transform transition-all scale-100">
      
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Order Success!</h2>
      
      {/* Yahan humne variable use kar liya, ab warning nahi aayegi */}
      {placedOrderDetails && (
        <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Order ID: #{placedOrderDetails.orderNumber || placedOrderDetails.orderId}
        </p>
      )}

      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Your order has been placed successfully. Get ready to receive your 3D parts!
      </p>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('/my-orders')}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          View My Orders
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}