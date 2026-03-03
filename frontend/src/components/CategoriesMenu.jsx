import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CategoriesMenu({ isMobile }) {
  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category/public');
        setCategories(res.data.data || []);
      } catch {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  /* ================= MOBILE ================= */
 if (isMobile) {
  return (
    <div className="flex flex-col w-full text-gray-800 dark:text-gray-200">

      {/* Products */}
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="
          w-full flex items-center justify-center gap-2
          px-5 py-3 rounded-lg font-medium
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
        "
      >
        <span>Products</span>

        {/* Arrow */}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            openMenu ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Categories */}
      {openMenu && (
        <div className="mt-3 space-y-2">
          {categories.map((cat) => {
            const isOpen = openCategory === cat.id;

            return (
              <div
                key={cat.id}
                className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Category */}
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className="
                    w-full flex justify-between items-center
                    px-5 py-3 font-medium
                    bg-gray-50 dark:bg-gray-900
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition
                  "
                >
                  {cat.categoryName}

                  {/* Arrow */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Subcategories */}
                {isOpen && (
                  <div className="pl-8 py-2 bg-white dark:bg-black">
                    {cat.subcategories?.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/category/${cat.categorySlug}/${sub.slug}`}
                        className="
                          block py-2 text-sm
                          text-gray-700 dark:text-gray-300
                          hover:text-indigo-600 dark:hover:text-indigo-400
                          transition
                        "
                      >
                        {sub.subCategoryName}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


  /* ================= DESKTOP ================= */
  return (
    <div className="relative group h-full flex items-center">
      {/* Trigger */}
      <div
        className="
flex items-center gap-2
    relative font-medium
    text-gray-800 dark:text-gray-200
    hover:text-black dark:hover:text-white
    transition-colors duration-300        "
      >
        Products
        <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      <div
        className="
          absolute left-0 top-full pt-3 z-[999]
          opacity-0 invisible scale-95 pointer-events-none
          group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:pointer-events-auto
          transition-all duration-200
        "
      >
        <div className="min-w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
          {categories.map((cat) => (
            <div key={cat.id} className="group/item relative">
              {/* Category */}
              <div
                className="
                  px-6 py-3.5 flex justify-between items-center
                  text-sm font-medium
                  text-gray-800 dark:text-gray-200
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  transition
                "
              >
                {cat.categoryName}
                {cat.subcategories?.length > 0 && <span>›</span>}
              </div>

              {/* Subcategories */}
              {cat.subcategories?.length > 0 && (
                <div
                  className="
                    absolute left-full top-0 ml-1 w-64
                    opacity-0 invisible pointer-events-none
                    group-hover/item:opacity-100 group-hover/item:visible group-hover/item:pointer-events-auto
                    transition
                  "
                >
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-2">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/category/${cat.categorySlug}/${sub.slug}`}
                        className="
                          block px-6 py-2.5 text-sm
                          text-gray-700 dark:text-gray-300
                          hover:bg-indigo-50 dark:hover:bg-indigo-900/40
                          hover:text-indigo-700 dark:hover:text-indigo-300
                          transition
                        "
                      >
                        {sub.subCategoryName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
