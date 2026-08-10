import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminSidebar from '../../../components/admin/AdminSidebar';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminOrders({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/order/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data);
      console.log("Orders array:", res.data.data);
      console.log("Total orders count:", res.data.data?.length || 0);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/order/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      placed: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
      delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    };
    return styles[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <AdminSidebar active="orders" onLogout={onLogout} />
        </div>

        {/* Mobile Sidebar (agar AdminSidebar ke andar hamburger handle ho raha hai to yeh theek rahega) */}
        <div className="md:hidden">
          <AdminSidebar active="orders" onLogout={onLogout} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full overflow-x-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Orders Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage and update all customer orders
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500">Loading orders...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white/60 dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6 pb-12">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg font-semibold tracking-tight dark:text-white">
                            #{order.orderNumber}
                          </h2>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Placed on {new Date(order.placedAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer + Address + Payment */}
                    <div className="px-4 sm:px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-100 dark:border-gray-800">
                      
                      {/* Customer */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Customer
                        </p>
                        <p className="font-medium dark:text-white">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{order.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.phone}</p>
                      </div>

                      {/* Address */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Shipping Address
                        </p>
                        <p className="text-sm dark:text-white leading-relaxed">
                          {order.addressLine1}
                          {order.addressLine2 && `, ${order.addressLine2}`}
                          {order.landmark && `, ${order.landmark}`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {order.city}, {order.state}, {order.country} - {order.pincode}
                        </p>
                      </div>

                      {/* Payment */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Payment
                        </p>
                        <p className="text-sm dark:text-white">
                          Method: <span className="font-medium">{order.paymentMethod}</span>
                        </p>
                        <p className="text-sm dark:text-white mt-0.5">
                          Status: <span className="font-medium">{order.paymentStatus}</span>
                        </p>
                        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
                          ₹{Number(order.totalAmount).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="px-4 sm:px-6 py-5">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Order Items
                      </p>
                      
                      <div className="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800">
                        <table className="w-full text-sm min-w-[560px]">
                          <thead>
                            <tr className="bg-gray-50/80 dark:bg-gray-800/60 text-left">
                              <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Product</th>
                              <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Price</th>
                              <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Qty</th>
                              <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {order.items.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        item.productImage
                                          ? `${API_URL}/${item.productImage.replace(/^\/+/, '')}`
                                          : `${API_URL}/uploads/products/default-product-image.jpg`
                                      }
                                      alt={item.productName}
                                      className="w-11 h-11 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                                      onError={(e) => {
                                        if (!e.target.src.includes("default-product-image.jpg")) {
                                          e.target.src = `${API_URL}/uploads/products/default-product-image.jpg`;
                                        }
                                      }}
                                    />
                                    <span className="font-medium dark:text-white line-clamp-2">
                                      {item.productName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                  ₹{Number(item.price).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-right font-medium dark:text-white">
                                  ₹{Number(item.total).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}