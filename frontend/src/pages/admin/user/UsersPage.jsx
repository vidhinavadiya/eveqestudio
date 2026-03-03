// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function UsersPage({ onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

const handleLogout = () => {
  onLogout();        // 🔥 THIS updates isLoggedIn in App.jsx
  navigate('/auth'); // ya '/'
};


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(res.data.data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar 
          active="users" 
          onLogout={handleLogout} 
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8">
              All Users
            </h1>

            <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Username</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{user.id}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{user.username}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{user.email}</td>
                        <td className="px-6 py-4 capitalize text-gray-900 dark:text-gray-200">
                          {user.role}
                        </td>
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

              {users.length === 0 && (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                  No users found.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Simple animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}