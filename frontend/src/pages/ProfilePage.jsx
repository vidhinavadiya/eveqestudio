// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilePage({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, [isLoggedIn, navigate]);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }

      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to load profile');

      setFormData({
        username: data.user.username || '',
        email: data.user.email || '',
        role: data.user.role || 'customer',
        phone: data.user.phone || '',
        address: data.user.address || '',
        city: data.user.city || '',
        state: data.user.state || '',
        pincode: data.user.pincode || ''
      });
    } catch (err) {
      console.error('Profile fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    if (isLoggedIn) fetchProfile();
  }, [isLoggedIn, fetchProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMessage('');
    setSaveError('');

    if (isEditing) {
      if (!formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        setSaveError('All fields are required');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Update failed');

      setSaveMessage('Profile updated successfully!');
      setIsEditing(false);

      // Refresh data after save
      await fetchProfile();
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      </div>

      {/* Main Content */}
      <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center p-4 animate-fadeIn">
        <div className="w-full max-w-3xl">
          <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Profile Header */}
            <div className="p-8 md:p-12 text-center border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 animate-fadeUp">
                Hi, {formData.username || 'User'}
              </h1>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="flex items-center justify-center gap-3 text-lg">
                  <span className="text-2xl">✉</span> {formData.email || 'Not added'}
                </p>
                <p className="flex items-center justify-center gap-3 text-lg">
                  <span className="text-2xl">☎</span> {formData.phone || 'Not added'}
                </p>
                <p className="flex items-center justify-center gap-3 text-lg">
                  <span className="text-2xl">🏘</span>
                  {formData.address || 'Not added'}
                  {formData.city && `, ${formData.city}`}
                  {formData.state && `, ${formData.state}`}
                  {formData.pincode && ` - ${formData.pincode}`}
                </p>
              </div>

              {/* Edit Profile Button */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-8 w-full py-4 px-8 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 relative animate-zoomIn">
            {/* Close Button */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-3xl transition-transform hover:scale-110 duration-200"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">
              Update Profile
            </h2>

            {saveMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 rounded-2xl text-center border border-green-300 dark:border-green-800/50 animate-pulseOnce">
                {saveMessage}
              </div>
            )}
            {saveError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 rounded-2xl text-center border border-red-300 dark:border-red-800/50 animate-pulseOnce">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    disabled
                    className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 ${isEditing && !formData.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="House no, street, area..."
                    className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 resize-none bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 ${isEditing && !formData.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Surat"
                      className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 ${isEditing && !formData.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="Gujarat"
                      className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 ${isEditing && !formData.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      placeholder="395004"
                      className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 ${isEditing && !formData.pincode ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <button
                  type="submit"
                  className="flex-1 py-4 px-8 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 px-8 rounded-xl font-semibold text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          <Footer />
      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseOnce {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.02); }
        }

        .animate-fadeIn     { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fadeUp     { animation: fadeUp 0.7s ease-out forwards; }
        .animate-zoomIn     { animation: zoomIn 0.4s ease-out forwards; }
        .animate-pulseOnce  { animation: pulseOnce 1.2s ease-in-out; }
      `}</style>
    </div>
  );
}