// src/pages/admin/coupons/Coupons.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function Coupons({ onLogout }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const initialCouponState = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minorderamount: '',
    maxDiscountAmount: '',
    isFirstOrderOnly: false,
    usageLimit: '',
    expiryDate: '',
    isActive: true,
  };

  const [newCoupon, setNewCoupon] = useState({ ...initialCouponState });
  const [editCoupon, setEditCoupon] = useState({ ...initialCouponState });

  const token = localStorage.getItem('token');

  // Fetch all coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/coupon/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(res.data.data || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load coupons');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCoupons();
  }, [token]);

  // Helper: format date for input[type=date]
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

const resetNewCoupon = () => {
  setNewCoupon({ ...initialCouponState });
};



  // Create coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!newCoupon.code.trim()) return setError('Coupon code is required');
    if (!newCoupon.discountValue) return setError('Discount value is required');

    try {
      const payload = {
        ...newCoupon,
        discountValue: parseFloat(newCoupon.discountValue) || 0,
        minorderamount: newCoupon.minorderamount ? parseFloat(newCoupon.minorderamount) : null,
        maxDiscountAmount: newCoupon.maxDiscountAmount ? parseFloat(newCoupon.maxDiscountAmount) : null,
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit, 10) : null,
        expiryDate: newCoupon.expiryDate || null,
      };

      const res = await axios.post('http://localhost:5000/api/coupon/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCoupons([...coupons, res.data.data || res.data]);
      setShowAddModal(false);
      resetNewCoupon();
      setSuccessMsg('Coupon created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  // Update coupon
  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!editCoupon.code.trim()) return setError('Coupon code is required');

    try {
      const payload = {
        ...editCoupon,
        discountValue: parseFloat(editCoupon.discountValue) || 0,
        minorderamount: editCoupon.minorderamount ? parseFloat(editCoupon.minorderamount) : null,
        maxDiscountAmount: editCoupon.maxDiscountAmount ? parseFloat(editCoupon.maxDiscountAmount) : null,
        usageLimit: editCoupon.usageLimit ? parseInt(editCoupon.usageLimit, 10) : null,
        expiryDate: editCoupon.expiryDate || null,
      };

      const res = await axios.put(
        `http://localhost:5000/api/coupon/update/${selectedCoupon.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCoupons(
        coupons.map((c) => (c.id === selectedCoupon.id ? res.data.data || res.data : c))
      );
      setShowEditModal(false);
      setSuccessMsg('Coupon updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update coupon');
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/coupon/delete/${selectedCoupon.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCoupons(coupons.filter((c) => c.id !== selectedCoupon.id));
      setShowDeleteModal(false);
      setSuccessMsg('Coupon deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="coupons" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
          Manage Coupons
        </h1>

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="text-green-600 dark:text-green-400 mb-4 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
            {successMsg}
          </p>
        )}

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Create New Coupon
        </button>

        {/* Coupons Table */}
        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              All Coupons ({coupons.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Code</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Value</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Min Order</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Max Disc</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Usage</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Expiry</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading coupons...</p>
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No coupons found. Create your first coupon.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{coupon.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{coupon.code}</td>
                      <td className="px-6 py-4 capitalize">{coupon.discountType}</td>
                      <td className="px-6 py-4">
                        {coupon.discountType === 'percentage' && (
                          <span>{coupon.discountValue}% OFF</span>
                        )}

                        {coupon.discountType === 'flat' && (
                          <span>₹{coupon.discountValue} OFF</span>
                        )}
                      </td>

                      <td className="px-6 py-4">{coupon.minorderamount || '-'}</td>
                      <td className="px-6 py-4">{coupon.maxDiscountAmount || '-'}</td>
                      <td className="px-6 py-4">
                        {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                      </td>
                      <td className="px-6 py-4">
                        {coupon.expiryDate
                          ? new Date(coupon.expiryDate).toLocaleDateString()
                          : 'No expiry'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            coupon.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-4">
                        <button
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setEditCoupon({
                              code: coupon.code,
                              discountType: coupon.discountType,
                              discountValue: coupon.discountValue || '',
                              minorderamount: coupon.minorderamount || '',
                              maxDiscountAmount: coupon.maxDiscountAmount || '',
                              isFirstOrderOnly: coupon.isFirstOrderOnly || false,
                              usageLimit: coupon.usageLimit || '',
                              expiryDate: formatDateForInput(coupon.expiryDate),
                              isActive: coupon.isActive || true,
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD COUPON MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 my-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Create New Coupon</h2>

              <form onSubmit={handleAddCoupon} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Coupon Code *</label>
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      placeholder="SUMMER25"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Type *</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Value *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      placeholder="25 or 150"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Order Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newCoupon.minorderamount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minorderamount: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      placeholder="500 (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Discount Amount (for % only)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newCoupon.maxDiscountAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountAmount: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      placeholder="optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      placeholder="10 = 10 times total (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={newCoupon.expiryDate}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newCoupon.isFirstOrderOnly}
                      onChange={(e) => setNewCoupon({ ...newCoupon, isFirstOrderOnly: e.target.checked })}
                    />
                    First order only
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newCoupon.isActive}
                      onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetNewCoupon();
                    }}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT COUPON MODAL */}
        {showEditModal && selectedCoupon && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 my-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Edit Coupon</h2>

              <form onSubmit={handleUpdateCoupon} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Coupon Code *</label>
                    <input
                      type="text"
                      value={editCoupon.code}
                      onChange={(e) => setEditCoupon({ ...editCoupon, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Type</label>
                    <select
                      value={editCoupon.discountType}
                      onChange={(e) => setEditCoupon({ ...editCoupon, discountType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Value</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editCoupon.discountValue}
                      onChange={(e) => setEditCoupon({ ...editCoupon, discountValue: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Order Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editCoupon.minorderamount}
                      onChange={(e) => setEditCoupon({ ...editCoupon, minorderamount: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Discount Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editCoupon.maxDiscountAmount}
                      onChange={(e) => setEditCoupon({ ...editCoupon, maxDiscountAmount: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={editCoupon.usageLimit}
                      onChange={(e) => setEditCoupon({ ...editCoupon, usageLimit: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={editCoupon.expiryDate}
                      onChange={(e) => setEditCoupon({ ...editCoupon, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editCoupon.isFirstOrderOnly}
                      onChange={(e) => setEditCoupon({ ...editCoupon, isFirstOrderOnly: e.target.checked })}
                    />
                    First order only
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editCoupon.isActive}
                      onChange={(e) => setEditCoupon({ ...editCoupon, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg"
                  >
                    Update Coupon
                  </button>
                </div>

      </form>

    </div>
  </div>
)}
        {/* Delete Confirmation */}
        {showDeleteModal && selectedCoupon && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Confirm Delete</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Are you sure you want to delete coupon <strong>{selectedCoupon.code}</strong>?<br />
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCoupon}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 shadow-md hover:shadow-lg"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}