import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

  // ✅ SAFE DEFAULT STATE
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

  // ✅ API CALL
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard',
                  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        );

        if (res.data.success) {
          const apiData = res.data.data;

          // 🔥 IMPORTANT: Convert string numbers → number
          setData({
            ...apiData,
            monthlySales: apiData.monthlySales.map(item => ({
              month: `Month ${item.month}`, // better label
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
    return <div className="p-10 text-center text-xl">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="flex min-h-screen">

        <AdminSidebar active="dashboard" onLogout={handleLogoutClick} />

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">

            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Admin Dashboard
            </h1>

            {/* ✅ STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card title="Total Users" value={data.totalUsers} />
              <Card title="Total Products" value={data.totalProducts} />
              <Card title="Total Orders" value={data.totalOrders} />
              <Card title="Pending Orders" value={data.pendingOrders} />
              <Card title="Delivered Orders" value={data.deliveredOrders} />
              <Card title="Total Revenue (₹)" value={data.totalRevenue} />
              <Card title="Today Orders" value={data.todayOrders} />
            </div>

            {/* ✅ CHART */}
            <div className="mt-10 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>

              {data.monthlySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.monthlySales}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No sales data</p>
              )}
            </div>

            {/* ✅ TOP PRODUCTS */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                {data.topProducts.length > 0 ? (
                  data.topProducts.map((item, index) => (
                    <div key={index} className="flex justify-between border-b py-2">
                      <span>{item.product?.productName}</span>
                      <span>{item.totalSold}</span>
                    </div>
                  ))
                ) : (
                  <p>No products found</p>
                )}
              </div>
            </div>

            {/* ✅ RECENT ORDERS */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                {data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between border-b py-2">
                      <span>#{order.id}</span>
                      <span>₹{order.totalAmount}</span>
                      <span>{order.orderStatus}</span>
                    </div>
                  ))
                ) : (
                  <p>No orders found</p>
                )}
              </div>
            </div>

            {/* ✅ USERS */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Latest Users</h2>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                {data.latestUsers.length > 0 ? (
                  data.latestUsers.map((user) => (
                    <div key={user.id} className="flex justify-between border-b py-2">
                      <span>{user.username}</span>
                      <span>{user.email}</span>
                    </div>
                  ))
                ) : (
                  <p>No users found</p>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ CARD
function Card({ title, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border rounded-xl p-5 shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value || 0}</p>
    </div>
  );
}

export default AdminDashboard;