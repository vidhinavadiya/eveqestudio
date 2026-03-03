// src/pages/seller/SellerDashboard.jsx
import React from 'react';
import SellerSidebar from '../../components/seller/SellerSidebar';

export default function SellerDashboard({ isLoggedIn, onLogout }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header (Top Bar) – fixed */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Seller Panel
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, Seller
            </span>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex pt-16"> {/* pt-16 header ke liye */}
        {/* Sidebar – fixed left */}
        <SellerSidebar active="dashboard" onLogout={onLogout} />

        {/* Main Content – sidebar ke right shift (ml-72) */}
        <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black dark:text-white">
            Seller Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {['Your Products: 20', 'Pending Orders: 15', 'Revenue: ₹50,000'].map((stat, i) => (
              <div 
                key={i} 
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <p className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
                  {stat}
                </p>
              </div>
            ))}
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Manage Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{i + 1}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">3D Printer Model {i + 1}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">₹{20000 + i * 5000}</td>
                      <td className="px-6 py-4 flex gap-4">
                        <button className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                          Edit
                        </button>
                        <button className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add more sections if needed */}
        </main>
      </div>
    </div>
  );
}