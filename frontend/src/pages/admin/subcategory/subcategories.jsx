// src/pages/admin/subcategory/AdminSubcategories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function AdminSubcategories({ onLogout }) {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Forms
  const [formData, setFormData] = useState({
    subCategoryName: '',
    categoryId: '',
    description: '',
    status: true,
    subCategoryImage: null
  });

  const token = localStorage.getItem('token');

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subcatRes] = await Promise.all([
          axios.get('http://localhost:5000/api/category', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/subcategory', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCategories(catRes.data.data);
        setSubcategories(subcatRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    if (!formData.subCategoryName || !formData.categoryId) return setError('Name & Category are required');

    const data = new FormData();
    data.append('subCategoryName', formData.subCategoryName);
    data.append('categoryId', formData.categoryId);
    data.append('description', formData.description);
    data.append('status', formData.status);
    if (formData.subCategoryImage) data.append('subCategoryImage', formData.subCategoryImage);

    try {
      if (selectedSubcategory) {
        const res = await axios.put(`http://localhost:5000/api/subcategory/${selectedSubcategory.id}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        // After updating subcategory
        const updatedSubcat = {
        ...res.data.data,
        category: categories.find(cat => cat.id === parseInt(res.data.data.categoryId))
        };
        setSubcategories(subcategories.map(sc => sc.id === updatedSubcat.id ? updatedSubcat : sc));
        setSuccessMsg('Subcategory updated successfully!');
      } else {
        const res = await axios.post('http://localhost:5000/api/subcategory', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        // Add category object manually
        const newSubcat = {
        ...res.data.data,
        category: categories.find(cat => cat.id === parseInt(res.data.data.categoryId))
        };
        setSubcategories([...subcategories, newSubcat]);
        setSuccessMsg('Subcategory added successfully!');
      }

      setFormData({ subCategoryName: '', categoryId: '', description: '', status: true, subCategoryImage: null });
      setSelectedSubcategory(null);
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subcategory');
    }
  };

  const handleEdit = (subcat) => {
    setFormData({
      subCategoryName: subcat.subCategoryName,
      categoryId: subcat.categoryId,
      description: subcat.description,
      status: subcat.status,
      subCategoryImage: null
    });
    setSelectedSubcategory(subcat);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/subcategory/${selectedSubcategory.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubcategories(subcategories.filter(sc => sc.id !== selectedSubcategory.id));
      setShowDeleteModal(false);
      setSuccessMsg('Subcategory deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="subcategories" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Manage Subcategories</h1>

        {error && <p className="text-red-600 dark:text-red-400 mb-4 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
        {successMsg && <p className="text-green-600 dark:text-green-400 mb-4 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">{successMsg}</p>}

        <button
          onClick={() => setShowAddModal(true)}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Add New Subcategory
        </button>

        {/* Table */}
        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold">All Subcategories ({subcategories.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                      <p className="mt-4">Loading subcategories...</p>
                    </td>
                  </tr>
                ) : subcategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No subcategories found.
                    </td>
                  </tr>
                ) : (
                  subcategories.map((sc) => (
                    <tr key={sc.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4">{sc.id}</td>
                      <td className="px-6 py-4">{sc.subCategoryName}</td>
                      <td className="px-6 py-4">{sc.category?.categoryName || ''}</td>
                      <td className="px-6 py-4">
                        {sc.subCategoryImage ? (
                          <img
                            src={`http://localhost:5000/uploads/subcategories/${sc.subCategoryImage}`}
                            alt={sc.subCategoryName}
                            className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-700"
                          />
                        ) : <span className="text-gray-500 dark:text-gray-400">No image</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${sc.status ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                          {sc.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-4">
                        <button
                          onClick={() => handleEdit(sc)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setSelectedSubcategory(sc); setShowDeleteModal(true); }}
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

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">{showAddModal ? 'Add New Subcategory' : 'Edit Subcategory'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-1 font-medium">Subcategory Name *</label>
                  <input
                    type="text"
                    name="subCategoryName"
                    value={formData.subCategoryName}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} /> Active
                </div>

                <div>
                  <label className="block mb-1 font-medium">Image</label>
                  <input type="file" name="subCategoryImage" onChange={handleChange} />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedSubcategory(null); }}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
                  >
                    {showAddModal ? 'Add Subcategory' : 'Update Subcategory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedSubcategory && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Are you sure you want to delete <strong>{selectedSubcategory.subCategoryName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
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
      </main>
    </div>
  );
}
