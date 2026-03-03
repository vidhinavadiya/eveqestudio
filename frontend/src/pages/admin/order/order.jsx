import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function AdminOrders({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders
const fetchOrders = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/order/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API Response:", res.data);           // ← yeh line add karo
    console.log("Orders array:", res.data.data);      // ← yeh bhi
    console.log("Total orders count:", res.data.data?.length || 0);
    setOrders(res.data.data || []);                   // safety ke liye || []
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
        `http://localhost:5000/api/order/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated");
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Sidebar – fixed width, full height, no shrink */}
      <div className="w-64 flex-shrink-0">
        <AdminSidebar active="orders" onLogout={onLogout} />
      </div>

      {/* Main content – sidebar ke right side push hoga */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Orders Management
          </h1>

          {loading ? (
            <div className="text-center py-10">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No orders found</div>
          ) : (
            <div className="space-y-6 pb-12">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div>
                      <p className="font-bold text-lg dark:text-white">
                        #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed at: {new Date(order.placedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                          order.orderStatus === "placed"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.orderStatus === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : order.orderStatus === "shipped"
                            ? "bg-indigo-100 text-indigo-700"
                            : order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-gray-300 rounded-md p-1 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Customer:
                      </p>
                      <p className="dark:text-white">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="dark:text-white">{order.email}</p>
                      <p className="dark:text-white">{order.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address:
                      </p>
                      <p className="dark:text-white">
                        {order.addressLine1}, {order.addressLine2}
                        {order.landmark && `, ${order.landmark}`}
                      </p>
                      <p className="dark:text-white">
                        {order.city}, {order.state}, {order.country} - {order.pincode}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment:
                      </p>
                      <p className="dark:text-white">Method: {order.paymentMethod}</p>
                      <p className="dark:text-white">Status: {order.paymentStatus}</p>
                      <p className="dark:text-white font-bold">
                        Total: ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg min-w-[600px]">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 border-b dark:border-gray-700">Product</th>
                          <th className="px-4 py-3 border-b dark:border-gray-700">Price</th>
                          <th className="px-4 py-3 border-b dark:border-gray-700">Qty</th>
                          <th className="px-4 py-3 border-b dark:border-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 border-b dark:border-gray-700">
                              <div className="flex items-center gap-3">
                                <img
                                  src={`http://localhost:5000/${item.productImage}`}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <span className="dark:text-white">{item.productName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-b dark:border-gray-700">₹{item.price}</td>
                            <td className="px-4 py-3 border-b dark:border-gray-700">{item.quantity}</td>
                            <td className="px-4 py-3 border-b dark:border-gray-700">₹{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}