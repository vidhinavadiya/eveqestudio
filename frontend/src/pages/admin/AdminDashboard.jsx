import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardSkeleton from '../admin/DashboardSkeleton';

const API_URL = process.env.REACT_APP_API_URL;

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    monthlySales: [],
    topProducts: [],
    recentOrders: [],
    latestUsers: []
  });

  const [loading, setLoading] = useState(true);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/home');
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const apiData = res.data.data;

          setData({
            ...apiData,
            monthlySales: apiData.monthlySales.map(item => ({
              month: `Month ${item.month}`,
              total: Number(item.total)
            })),
            topProducts: apiData.topProducts.map(item => ({
              ...item,
              totalSold: Number(item.totalSold)
            })),
            recentOrders: apiData.recentOrders.map(order => ({
              ...order,
              totalAmount: Number(order.totalAmount)
            }))
          });
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <div className="flex min-h-screen">
        <AdminSidebar active="dashboard" onLogout={handleLogoutClick} />

        {/* Important: min-w-0 + overflow-x-hidden + smaller padding on mobile */}
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 md:p-8 lg:p-10 md:ml-72 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-10">

            {/* Header */}
            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Overview of your store performance
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <PremiumCard title="Total Users" value={data.totalUsers} accent="from-blue-500/20 to-blue-600/10" />
              <PremiumCard title="Total Products" value={data.totalProducts} accent="from-violet-500/20 to-violet-600/10" />
              <PremiumCard title="Total Orders" value={data.totalOrders} accent="from-emerald-500/20 to-emerald-600/10" />
              <PremiumCard title="Pending Orders" value={data.pendingOrders} accent="from-amber-500/20 to-amber-600/10" />
              <PremiumCard title="Delivered Orders" value={data.deliveredOrders} accent="from-teal-500/20 to-teal-600/10" />
              <PremiumCard title="Total Revenue" value={`₹${Number(data.totalRevenue).toLocaleString()}`} accent="from-rose-500/20 to-rose-600/10" />
              <PremiumCard title="Today's Orders" value={data.todayOrders} accent="from-indigo-500/20 to-indigo-600/10" />
            </div>
            {/* Bottom Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">

              {/* Top Products */}
              <div className="xl:col-span-1 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-base sm:text-lg font-medium tracking-tight">Top Selling Products</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.topProducts.length > 0 ? (
                    data.topProducts.map((item, index) => (
                      <div key={index} className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-medium text-gray-400 w-5 flex-shrink-0">{index + 1}</span>
                          <span className="text-sm font-medium truncate">
                            {item.product?.productName || "Unknown"}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-3">
                          {item.totalSold}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-6 py-8 text-center">No products found</p>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="xl:col-span-2 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-base sm:text-lg font-medium tracking-tight">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        <th className="px-4 sm:px-6 py-3 font-medium">Order ID</th>
                        <th className="px-4 sm:px-6 py-3 font-medium">Amount</th>
                        <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {data.recentOrders.length > 0 ? (
                        data.recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                            <td className="px-4 sm:px-6 py-3.5 font-medium">#{order.id}</td>
                            <td className="px-4 sm:px-6 py-3.5">₹{Number(order.totalAmount).toLocaleString()}</td>
                            <td className="px-4 sm:px-6 py-3.5">
                              <StatusBadge status={order.orderStatus} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Latest Users */}
            <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-base sm:text-lg font-medium tracking-tight">Latest Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-4 sm:px-6 py-3 font-medium">Username</th>
                      <th className="px-4 sm:px-6 py-3 font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.latestUsers.length > 0 ? (
                      data.latestUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="px-4 sm:px-6 py-3.5 font-medium">{user.username}</td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 dark:text-gray-300">{user.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-6 py-10 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Premium Card
function PremiumCard({ title, value, accent }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
      <div className="relative z-10">
        <p className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1.5 tracking-tight">
          {value || 0}
        </p>
      </div>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const styles = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };

  const style = styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return <span className={`${base} ${style}`}>{status}</span>;
}

export default AdminDashboard;