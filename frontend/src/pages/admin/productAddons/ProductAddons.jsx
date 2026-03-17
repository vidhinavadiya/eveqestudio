import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const API_BASE = 'http://localhost:5000/api/link'; // ← your route
const BASE_MEDIA_URL = 'http://localhost:5000';   // adjust if needed

export default function ProductAddons({ onLogout }) {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    productId: '',
    image: null,          // new file
    supportLinks: [{ title: '', link: '' }],
    points: [{ point: '' }],
  });

  const [previewImage, setPreviewImage] = useState(null); // for new upload preview
  const [existingImage, setExistingImage] = useState(null); // url from edit

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

    const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/product", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setProducts(res.data.data || []);
  } catch (err) {
    console.error("Failed to load products");
  }
}, [token]);

useEffect(() => {
  if (token) {
    fetchAddons();
    fetchProducts();
  }
}, [token, fetchProducts]);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin or seller');
        return;
      }

      const res = await axios.get(`${API_BASE}/public`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddons(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load addons');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      productId: '',
      image: null,
      supportLinks: [{ title: '', link: '' }],
      points: [{ point: '' }],
    });
    setPreviewImage(null);
    setExistingImage(null);
    setIsEditMode(false);
    setEditId(null);
    setCurrentStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ──────────────────────────────────────────────
  // Support Links helpers
  // ──────────────────────────────────────────────
  const addSupportLink = () => {
    setFormData((prev) => ({
      ...prev,
      supportLinks: [...prev.supportLinks, { title: '', link: '' }],
    }));
  };

  const removeSupportLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      supportLinks: prev.supportLinks.filter((_, i) => i !== index),
    }));
  };

  const updateSupportLink = (index, field, value) => {
    setFormData((prev) => {
      const newLinks = [...prev.supportLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, supportLinks: newLinks };
    });
  };

  // ──────────────────────────────────────────────
  // Points helpers
  // ──────────────────────────────────────────────
  const addPoint = () => {
    setFormData((prev) => ({
      ...prev,
      points: [...prev.points, { point: '' }],
    }));
  };

  const removePoint = (index) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index),
    }));
  };

  const updatePoint = (index, value) => {
    setFormData((prev) => {
      const newPoints = [...prev.points];
      newPoints[index] = { ...newPoints[index], point: value };
      return { ...prev, points: newPoints };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    if (!formData.title.trim() || !formData.productId) {
      alert('Title and Product ID are required!');
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('productId', formData.productId);
    form.append('supportLinks', JSON.stringify(formData.supportLinks));
    form.append('points', JSON.stringify(formData.points));

if (formData.image) {
    console.log("Uploading image →", formData.image.name, formData.image.size);
    form.append('image', formData.image);
  } else {
    console.log("No image selected");
  }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditMode) {
        await axios.put(`${API_BASE}/${editId}`, form, config);
        setSuccessMsg('Addon updated successfully!');
      } else {
        await axios.post(API_BASE, form, config);
        setSuccessMsg('Addon created successfully!');
      }

      await fetchAddons();
      setShowFormModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save addon');
    }
  };

  const handleEdit = (addon) => {
    setFormData({
      title: addon.title || '',
      productId: addon.productId?.toString() || '',
      image: null,
      supportLinks: addon.supportLinks?.length > 0
        ? addon.supportLinks
        : [{ title: '', link: '' }],
      points: addon.points?.length > 0
        ? addon.points
        : [{ point: '' }],
    });

setExistingImage(addon.image ? `${BASE_MEDIA_URL}/uploads/product-addons/${addon.image}` : null);
    setPreviewImage(null);

    setEditId(addon.id);
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg('Addon deleted successfully');
      fetchAddons();
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete addon');
    }
  };

  const stepNames = ['Basic Info', 'Support Links', 'Key Points', 'Image'];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="product_addons" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Manage Product Addons</h1>

        {error && <p className="text-red-600 dark:text-red-400 mb-4 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
        {successMsg && <p className="text-green-600 dark:text-green-400 mb-4 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">{successMsg}</p>}

        <button
          onClick={() => { resetForm(); setShowFormModal(true); }}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Add New Addon
        </button>

        {/* ────────────── Table ────────────── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold">All Addons ({addons.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Product ID</th>
                  <th className="px-6 py-4 font-semibold">Links</th>
                  <th className="px-6 py-4 font-semibold">Points</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                      <p className="mt-4">Loading addons...</p>
                    </td>
                  </tr>
                ) : addons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No addons found.
                    </td>
                  </tr>
                ) : (
                  addons.map((addon) => (
<tr key={addon.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
        {addon.id}
      </td>     
<td className="px-6 py-4">
  {addon.image ? (
    <img
src={`${BASE_MEDIA_URL}/uploads/product-addons/${addon.image}`}
      alt={addon.title || 'Addon image'}
      className="h-16 w-16 object-cover rounded border border-gray-300 dark:border-gray-600"
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/64?text=No+Image'; // fallback
        e.target.alt = 'Image not found';
      }}
    />
  ) : (
    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
      No Img
    </div>
  )}
</td>
                      <td className="px-6 py-4 font-medium">{addon.title}</td>
                      <td className="px-6 py-4">{addon.productId}</td>
                      <td className="px-6 py-4">{addon.supportLinks?.length || 0}</td>
                      <td className="px-6 py-4">{addon.points?.length || 0}</td>
                      <td className="px-6 py-4 flex gap-4">
                        <button
                          onClick={() => handleEdit(addon)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(addon.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
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

        {/* ────────────── Form Modal ────────────── */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Update Addon' : 'Add New Addon'}
              </h2>

              {/* Steps */}
              <div className="flex justify-between mb-8">
                {stepNames.map((name, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 text-center py-2 ${currentStep === idx + 1 ? 'font-bold border-b-2 border-black dark:border-white' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {name}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Product ID <span className="text-red-500">*</span>
                      </label>
                      <select
  name="productId"
  value={formData.productId}
  onChange={(e) =>
    setFormData({
      ...formData,
      productId: Number(e.target.value)
    })
  }
  required
  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
>
  <option value="">Select Product</option>

  {products.map((product) => (
    <option
      key={product.productId}
      value={product.productId}
    >
      {product.productName}
    </option>
  ))}
</select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Support Links</h3>
                      <button
                        type="button"
                        onClick={addSupportLink}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        + Add Link
                      </button>
                    </div>

                    {formData.supportLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap gap-4 mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <input
                          value={link.title}
                          onChange={(e) => updateSupportLink(idx, 'title', e.target.value)}
                          placeholder="Link Title (e.g. User Manual)"
                          className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <input
                          value={link.link}
                          onChange={(e) => updateSupportLink(idx, 'link', e.target.value)}
                          placeholder="https://example.com/..."
                          className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeSupportLink(idx)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Key Points / Features</h3>
                      <button
                        type="button"
                        onClick={addPoint}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        + Add Point
                      </button>
                    </div>

                    {formData.points.map((p, idx) => (
                      <div key={idx} className="flex gap-4 mb-4 items-center">
                        <input
                          value={p.point}
                          onChange={(e) => updatePoint(idx, e.target.value)}
                          placeholder="e.g. 1 Year Warranty"
                          className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removePoint(idx)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Addon Image</h3>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
                    />

                    {(previewImage || existingImage) && (
                      <div className="mt-6">
                        <h4 className="text-lg font-medium mb-3">Preview</h4>
                        <div className="inline-block relative">
                          <img
                            src={previewImage || existingImage}
                            alt="Preview"
                            className="max-h-64 object-contain rounded border border-gray-300 dark:border-gray-700"
                          />
                          {previewImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(null);
                                setFormData((p) => ({ ...p, image: null }));
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                          e.preventDefault();
                          setCurrentStep((p) => p - 1);
                        }}                      
                        className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                  )}

{currentStep < 4 ? (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();           // ← very important!
      setCurrentStep((p) => p + 1);
    }}
    className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
  >
    Next
  </button>
) : (
  <button
    type="submit"
    className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
  >
    {isEditMode ? 'Update Addon' : 'Create Addon'}
  </button>
)}
                  <button
                    type="button"
                    onClick={() => { setShowFormModal(false); resetForm(); }}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Are you sure? This addon will be permanently deleted.
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
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400"
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