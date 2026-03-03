// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar({ active = 'dashboard', onLogout }) {
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
            3D
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight">
              Admin Hub
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-600">
              3D Printer Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-5 space-y-1.5 mt-4">
        <button className={itemClass('dashboard')} onClick={() => navigate('/admin')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </button>

        <button className={itemClass('users')} onClick={() => navigate('/admin/users')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </button>
        <button className={itemClass('categories')} onClick={() => navigate('/admin/categories')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Categories
        </button>
        <button className={itemClass('subcategories')} onClick={() => navigate('/admin/subcategories')}>
      <svg  className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
        <path  strokeLinecap="round"  strokeLinejoin="round"  strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
      </svg>
      Subcategories
      </button>

        <button className={itemClass('products')} onClick={() => navigate('/admin/products')}>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
  Products
</button>

<button className={itemClass('coupons')} onClick={() => navigate('/admin/coupons')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h14a2 2 0 012 2v12a4 4 0 01-4 4h-2m-6 0h6m-6 0v-4m6 4v-4m-6 0H5m6 0h6" />
          </svg>
          Coupons
        </button>
        <button className={itemClass('bxgy')} onClick={() => navigate('/admin/bxgy')}>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m4-4H8m12 0a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h16z" />
  </svg>
  BXGY Coupons
</button>

        <button className={itemClass('orders')} onClick={() => navigate('/admin/orders')}>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M3 7h18M3 12h18M3 17h18" 
    />
  </svg>
  Orders
</button>

<button 
  className={itemClass('reviews')} 
  onClick={() => navigate('/admin/reviews')}
>
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.98 9.393c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.355-3.966z"
    />
  </svg>
  Reviews
</button>
<button 
  className={itemClass('faqs')} 
  onClick={() => navigate('/admin/faqs')}
>
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.2-3.6A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
  FAQs
</button>

        {/* Spacer */}
        <div className="h-8"></div>

        {/* Logout – bottom */}
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