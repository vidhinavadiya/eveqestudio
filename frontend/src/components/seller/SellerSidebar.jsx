// src/components/seller/SellerSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerSidebar({ active = 'dashboard', onLogout }) {
  const navigate = useNavigate();

  const itemClass = (name) =>
    `group flex items-center gap-3 w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 ${
      active === name
        ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white font-semibold shadow-inner border-l-4 border-black dark:border-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white hover:translate-x-1 hover:shadow-sm'
    }`;

  return (
    <aside className="hidden md:block w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-xl fixed top-0 bottom-0 left-0 z-40 overflow-y-auto animate-slideIn">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xl shadow-md">
            SP
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight">
              Seller Panel
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-600">
              Manage Your Store
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-5 space-y-1.5 mt-4">
        <button className={itemClass('dashboard')} onClick={() => navigate('/seller')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </button>

        <button className={itemClass('products')} onClick={() => navigate('/seller/products')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          My Products
        </button>

        <button className={itemClass('orders')} onClick={() => navigate('/seller/orders')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Orders
        </button>

        <button className={itemClass('earnings')} onClick={() => navigate('/seller/earnings')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Earnings & Payouts
        </button>

        <button className={itemClass('reviews')} onClick={() => navigate('/seller/reviews')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Reviews
        </button>

        <button className={itemClass('settings')} onClick={() => navigate('/seller/settings')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>

        {/* Spacer */}
        <div className="h-8"></div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-white bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white dark:text-black hover:from-gray-800 hover:to-gray-900 dark:hover:from-gray-200 dark:hover:to-gray-100 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </nav>
    </aside>
  );
}