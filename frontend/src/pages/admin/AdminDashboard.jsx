// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();               // App.jsx ka logout function call
    navigate('/home');        // ya '/auth' ya '/' – jo bhi chahiye
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar 
          active="dashboard" 
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
              Admin Dashboard
            </h1>

            {/* Yahan aapka baaki dashboard content rahega – bilkul same */}
            {/* Example placeholder (aap isko replace kar sakte ho) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">0</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Active Printers
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">0</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Pending Orders
                </h3>
                <p className="text-3xl font-bold text-black dark:text-white">0</p>
              </div>
            </div>

            {/* Agar aapke paas real dashboard content hai to woh yahan daal dena */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;