// src/pages/admin/category/Categories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function Categories({ onLogout }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Forms (status add kiya)
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    categorySlug: '', // backend auto generate karega, isliye optional
    categoryDescription: '',
    status: true,
    categoryImage: null
  });

  const [editForm, setEditForm] = useState({
    categoryName: '',
    categorySlug: '',
    categoryDescription: '',
    status: true,
    categoryImage: null
  });

  const token = localStorage.getItem('token');

  // Fetch all categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data.data || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCategories();
  }, [token]);

  // Add new category (slug backend generate karega)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!newCategory.categoryName.trim()) {
      return setError('Category Name is required');
    }

    const formData = new FormData();
    formData.append('categoryName', newCategory.categoryName.trim());
    if (newCategory.categorySlug.trim()) formData.append('categorySlug', newCategory.categorySlug.trim().toLowerCase().replace(/\s+/g, '-'));
    if (newCategory.categoryDescription.trim()) formData.append('categoryDescription', newCategory.categoryDescription.trim());
    formData.append('status', newCategory.status ? true : false);
    if (newCategory.categoryImage) formData.append('categoryImage', newCategory.categoryImage);

    try {
      const res = await axios.post('http://localhost:5000/api/category', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setCategories([...categories, res.data.data || res.data]);
      setShowAddModal(false);
      setNewCategory({ categoryName: '', categorySlug: '', categoryDescription: '', status: 'active', categoryImage: null });
      setSuccessMsg('Category added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!editForm.categoryName.trim()) {
      return setError('Category Name is required');
    }

    const formData = new FormData();
    formData.append('categoryName', editForm.categoryName.trim());
    if (editForm.categorySlug.trim()) formData.append('categorySlug', editForm.categorySlug.trim().toLowerCase().replace(/\s+/g, '-'));
    if (editForm.categoryDescription.trim()) formData.append('categoryDescription', editForm.categoryDescription.trim());
    formData.append('status', newCategory.status ? true : false);
    if (editForm.categoryImage) formData.append('categoryImage', editForm.categoryImage);

    try {
      const res = await axios.put(`http://localhost:5000/api/category/${selectedCategory.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setCategories(categories.map(cat => cat.id === selectedCategory.id ? res.data.data || res.data : cat));
      setShowEditModal(false);
      setSuccessMsg('Category updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };

  // Delete category
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/category/${selectedCategory.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setShowDeleteModal(false);
      setSuccessMsg('Category deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="categories" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
          Manage Categories
        </h1>

        {error && <p className="text-red-600 dark:text-red-400 mb-4 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
        {successMsg && <p className="text-green-600 dark:text-green-400 mb-4 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">{successMsg}</p>}

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Add New Category
        </button>

        {/* Categories Table */}
        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              All Categories ({categories.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Slug</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Products</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Image</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No categories found. Add your first category.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{cat.id}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{cat.categoryName}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{cat.categorySlug}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{cat.productCount || 0}</td>
                      <td className="px-6 py-4">
                        {cat.categoryImage ? (
                          <img
                            src={`http://localhost:5000/uploads/categories/${cat.categoryImage}`} // backend uploads folder
                            alt={cat.categoryName}
                            className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-700"
                            onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} // fallback
                          />
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          cat.status
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {cat.status ? 'Active' : 'Inactive'}
                      </span>
                  
                      </td>
                      <td className="px-6 py-4 flex gap-4">
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowEditModal(true);
                            setEditForm({
                              categoryName: cat.categoryName,
                              categorySlug: cat.categorySlug,
                              categoryDescription: cat.categoryDescription || '',
                              status: Boolean(cat.status),
                              categoryImage: null
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
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
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Add New Category</h2>

            <form onSubmit={handleAddCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.categoryName}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="e.g. FDM Printers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug (leave empty for auto-generate)</label>
                <input
                  type="text"
                  value={newCategory.categorySlug}
                  onChange={(e) => setNewCategory({ ...newCategory, categorySlug: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="e.g. fdm-printers (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={newCategory.categoryDescription}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryDescription: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newCategory.status}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, status: e.target.checked })
                }
              />
              Active
            </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCategory({ ...newCategory, categoryImage: e.target.files[0] || null })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Edit Category</h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={editForm.categoryName}
                  onChange={(e) => setEditForm({ ...editForm, categoryName: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="e.g. FDM Printers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug (leave empty for auto-generate)</label>
                <input
                  type="text"
                  value={editForm.categorySlug}
                  onChange={(e) => setEditForm({ ...editForm, categorySlug: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="e.g. fdm-printers (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={editForm.categoryDescription}
                  onChange={(e) => setEditForm({ ...editForm, categoryDescription: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.checked })
                  }
                />
                Active
              </label>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Image (leave empty to keep current)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, categoryImage: e.target.files[0] || null })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Are you sure you want to delete <strong>{selectedCategory.categoryName}</strong>?<br />
              This action cannot be undone.
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
    </div>
  );
}