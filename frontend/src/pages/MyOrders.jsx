import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MyOrders = ({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/order/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Navbar with correct props */}
            <Navbar 
                isLoggedIn={isLoggedIn} 
                onLogout={onLogout} 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
            />

            <div className="max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                            My Orders
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Check the status of your recent orders and downloads.
                        </p>
                    </div>
                    <Link to="/all-products" className="text-indigo-600 font-bold hover:underline">
                        Continue Shopping →
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold dark:text-white">No orders yet</h3>
                        <p className="text-gray-500 mt-2">Looks like you haven't ordered anything yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div 
                                key={order.id || order._id} 
                                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b dark:border-gray-800">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order Placed</p>
                                            <p className="text-sm font-semibold dark:text-gray-200">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total</p>
                                            <p className="text-sm font-black dark:text-white">₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Status</p>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                            order.orderStatus === 'confirmed' || order.orderStatus === 'delivered' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 border dark:border-gray-700">
                                                        <img 
  src={
    item.productImage
      ? `http://localhost:5000/${item.productImage.replace(/^\/+/, '')}`
      : `http://localhost:5000/uploads/products/default-product-image.jpg`
  }
  alt={item.productName}
  className="w-full h-full object-cover"
onError={(e) => {
  if (!e.target.src.includes("default-product-image.jpg")) {
    e.target.src = "http://localhost:5000/uploads/products/default-product-image.jpg";
  }
}}
/>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.productName}</h4>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex flex-col justify-end gap-3 min-w-[150px]">
                                            <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                                                Track Order
                                            </button>
                                            <button className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-all">
                                                Order Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;