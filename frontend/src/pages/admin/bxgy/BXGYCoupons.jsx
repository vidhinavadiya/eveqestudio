import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';

export default function BXGYCoupons({ onLogout }) {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const initialForm = {
    code: '',
    description: '',
    buyProductIds: [],
    buyQuantity: 1,
    freeProductIds: [],
    freeQuantity: 1,
    startDate: '',
    endDate: '',
    active: true,
    maxUsagePerUser: 1,
    maxTotalUsage: 0,
  };

  const [newCoupon, setNewCoupon] = useState({ ...initialForm });
  const [editCoupon, setEditCoupon] = useState({ ...initialForm });

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [prodRes, couponRes] = await Promise.all([
        axios.get('http://localhost:5000/api/product', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/bxgy-coupon', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProducts(prodRes.data.data || []);
      setCoupons(couponRes.data.coupons || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addProductToArray = (type, id, isEdit) => {
    if (!id) return;
    const setter = isEdit ? setEditCoupon : setNewCoupon;
    const state = isEdit ? editCoupon : newCoupon;
    const field = type === 'buy' ? 'buyProductIds' : 'freeProductIds';
    const currentArray = Array.isArray(state[field]) ? state[field] : [];
    if (!currentArray.includes(Number(id))) {
      setter({ ...state, [field]: [...currentArray, Number(id)] });
    }
  };

  const removeProductFromArray = (type, id, isEdit) => {
    const setter = isEdit ? setEditCoupon : setNewCoupon;
    const state = isEdit ? editCoupon : newCoupon;
    const field = type === 'buy' ? 'buyProductIds' : 'freeProductIds';
    const currentArray = Array.isArray(state[field]) ? state[field] : [];
    setter({ ...state, [field]: currentArray.filter(p => p !== id) });
  };

  const handleSave = async (e, isEdit) => {
    e.preventDefault();
    const data = isEdit ? editCoupon : newCoupon;
    const url = isEdit 
      ? `http://localhost:5000/api/bxgy-coupon/${selectedCoupon.id}` 
      : 'http://localhost:5000/api/bxgy-coupon/add';
    
    try {
      await axios[isEdit ? 'put' : 'post'](url, data, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
      isEdit ? setShowEditModal(false) : setShowAddModal(false);
      toast.success(isEdit ? 'Coupon Updated!' : 'Coupon Created!');
      if (!isEdit) setNewCoupon({ ...initialForm });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving coupon');
    }
  };

  // Professional Delete Logic with Modal
  const handleDelete = async () => {
    if (!selectedCoupon) return;
    try {
      await axios.delete(`http://localhost:5000/api/bxgy-coupon/${selectedCoupon.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Coupon Deleted!");
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      toast.error("Error deleting coupon");
    }
  };

  const ProductTags = ({ selectedIds, type, isEdit }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {(selectedIds || []).map(id => (
        <span key={id} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-[11px] flex items-center gap-2 border border-gray-200 dark:border-gray-700">
          {products.find(p => p.productId === id)?.productName || `ID: ${id}`}
          <button type="button" onClick={() => removeProductFromArray(type, id, isEdit)} className="hover:text-red-500 font-bold">×</button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="bxgy" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
          BXGY Coupons
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Add New Offer
        </button>

        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Active Offers ({coupons.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Code</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Logic</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Limits</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Validity</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No offers found.</td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4 font-bold">{c.code}</td>
                      <td className="px-6 py-4 text-sm">Buy {c.buyQuantity} → Get {c.freeQuantity} Free</td>
                      <td className="px-6 py-4 text-xs">User: {c.maxUsagePerUser}x | Cap: {c.maxTotalUsage || '∞'}</td>
                      <td className="px-6 py-4 text-[11px]">
                        <span className="text-green-600 dark:text-green-400">{new Date(c.startDate).toLocaleDateString()}</span>
                        <br />
                        <span className="text-red-500">{new Date(c.endDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 flex gap-4">
                        <button onClick={() => { setSelectedCoupon(c); setEditCoupon(c); setShowEditModal(true); }} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold transition">Edit</button>
                        <button onClick={() => { setSelectedCoupon(c); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800 dark:text-red-400 font-semibold transition">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center transform transition-all animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-red-600 dark:text-red-500 text-3xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Are you sure you want to delete coupon <strong>{selectedCoupon.code}</strong>?<br />
              This action cannot be undone and will remove the offer from all users.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 transition shadow-md hover:shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add/Edit Modal --- */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              {showEditModal ? 'Edit BXGY Offer' : 'Add New BXGY Offer'}
            </h2>

            <form onSubmit={(e) => handleSave(e, showEditModal)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    value={showEditModal ? editCoupon.code : newCoupon.code}
                    onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), code: e.target.value.toUpperCase() })}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="e.g. BOGO2026"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={showEditModal ? editCoupon.description : newCoupon.description}
                    onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), description: e.target.value })}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="e.g. Buy 2 get 1 free on PLA"
                  />
                </div>
              </div>

              {/* Buy Logic */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">Buy Conditions</label>
                <div className="flex gap-4 mb-3">
                  <select 
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    onChange={e => addProductToArray('buy', e.target.value, showEditModal)}
                  >
                    <option value="">Select Products</option>
                    {products.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-24 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    value={showEditModal ? editCoupon.buyQuantity : newCoupon.buyQuantity} 
                    onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), buyQuantity: e.target.value })}
                  />
                </div>
                <ProductTags selectedIds={showEditModal ? editCoupon.buyProductIds : newCoupon.buyProductIds} type="buy" isEdit={showEditModal} />
              </div>

              {/* Reward Logic */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">Reward (Free)</label>
                <div className="flex gap-4 mb-3">
                  <select 
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    onChange={e => addProductToArray('free', e.target.value, showEditModal)}
                  >
                    <option value="">Select Products</option>
                    {products.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-24 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                    value={showEditModal ? editCoupon.freeQuantity : newCoupon.freeQuantity} 
                    onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), freeQuantity: e.target.value })}
                  />
                </div>
                <ProductTags selectedIds={showEditModal ? editCoupon.freeProductIds : newCoupon.freeProductIds} type="free" isEdit={showEditModal} />
              </div>

              {/* Limits & Dates */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tight">User Limit</label>
                  <input type="number" value={showEditModal ? editCoupon.maxUsagePerUser : newCoupon.maxUsagePerUser} onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), maxUsagePerUser: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tight">Total Cap</label>
                  <input type="number" value={showEditModal ? editCoupon.maxTotalUsage : newCoupon.maxTotalUsage} onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), maxTotalUsage: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tight">Starts</label>
                  <input type="date" value={(showEditModal ? (editCoupon.startDate || '') : (newCoupon.startDate || '')).split('T')[0]} onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), startDate: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tight">Ends</label>
                  <input type="date" value={(showEditModal ? (editCoupon.endDate || '') : (newCoupon.endDate || '')).split('T')[0]} onChange={e => (showEditModal ? setEditCoupon : setNewCoupon)({ ...(showEditModal ? editCoupon : newCoupon), endDate: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" required />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
                >
                  {showEditModal ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}