import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const API_BASE_URL = 'http://localhost:5000/api/product';
const CATEGORY_API = 'http://localhost:5000/api/category/public';
const SUBCATEGORY_API = 'http://localhost:5000/api/subcategory/public';
const BASE_MEDIA_URL = 'http://localhost:5000'; // For existing media URLs

export default function Products({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [updatingId, setUpdatingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    productName: '',
    productTitle: '',
    categoryId: '',
    subcategoryId: '',
    sku: '',
    mrp: '',
    sellingPrice: '',
    discountPrice: '',
    status: 'active',
    shortDescription: '',
    productDescription: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    manufacturerName: '',
    countryOfOrigin: '',
    netQuantity: '',
    printingTime: '',
    material: '',
    stockQuantity: '0',

    // Nested arrays
    keyPoints: [{ pointText: '', sortOrder: 1 }],
    colors: [{ colorName: '', colorCode: '', isActive: true }],
    sizes: [{ sizeName: '', sizeValue: '', isActive: true }],
    letters: [{ letter: '', price: '', isActive: true }],
    customizationGroups: [
      {
        groupName: '',
        sortOrder: 1,
        fields: [
          {
            label: '',
            fieldType: 'text',
            isRequired: true,
            sortOrder: 1,
            allowedValues: '',
            minLength: '',
            maxLength: '',
          },
        ],
      },
    ],

    newMedia: [], // New files (images/videos)
  });

  const [existingMedia, setExistingMedia] = useState([]); // Existing {id, url, type} from backend
  const [removedMediaIds, setRemovedMediaIds] = useState([]); // IDs to delete on update

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin or seller');
        return;
      }

      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const catRes = await axios.get(CATEGORY_API);
        const subRes = await axios.get(SUBCATEGORY_API);

        setCategories(catRes.data.data || []);
        setSubcategories(subRes.data.data || []);
      } catch (err) {
        console.error('Category load error', err);
      }
    };

    loadCategoryData();
  }, []);

  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: '',
    }));

    const filtered = subcategories.filter(
      (sub) => String(sub.categoryId) === String(categoryId)
    );

    setFilteredSubcategories(filtered);
  };

  const handleSubcategorySelect = (e) => {
    setFormData((prev) => ({
      ...prev,
      subcategoryId: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleMediaUpload = (e) => {
  const files = Array.from(e.target.files || []);
  setFormData(prev => ({
    ...prev,
    newMedia: [...prev.newMedia, ...files]
  }));
};

  const removeNewMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      newMedia: prev.newMedia.filter((_, i) => i !== index),
    }));
  };

  const removeExistingMedia = (id, index) => {
    setRemovedMediaIds((prev) => [...prev, id]);
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Simple array helpers
  const updateSimpleArray = (arrayName, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSimpleItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  const removeSimpleItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  // Customization Groups helpers
  const updateGroup = (groupIndex, field, value) => {
    setFormData((prev) => {
      const newGroups = [...prev.customizationGroups];
      newGroups[groupIndex] = { ...newGroups[groupIndex], [field]: value };
      return { ...prev, customizationGroups: newGroups };
    });
  };

  const updateField = (groupIndex, fieldIndex, field, value) => {
    setFormData((prev) => {
      const newGroups = [...prev.customizationGroups];
      const newFields = [...newGroups[groupIndex].fields];
      newFields[fieldIndex] = { ...newFields[fieldIndex], [field]: value };
      newGroups[groupIndex].fields = newFields;
      return { ...prev, customizationGroups: newGroups };
    });
  };

  const addField = (groupIndex) => {
    setFormData((prev) => {
      const newGroups = [...prev.customizationGroups];
      newGroups[groupIndex].fields.push({
        label: '',
        fieldType: 'text',
        isRequired: true,
        sortOrder: 1,
        allowedValues: '',
        minLength: '',
        maxLength: '',
      });
      return { ...prev, customizationGroups: newGroups };
    });
  };

  const removeField = (groupIndex, fieldIndex) => {
    setFormData((prev) => {
      const newGroups = [...prev.customizationGroups];
      newGroups[groupIndex].fields = newGroups[groupIndex].fields.filter(
        (_, i) => i !== fieldIndex
      );
      return { ...prev, customizationGroups: newGroups };
    });
  };

  const addGroup = () => {
    setFormData((prev) => ({
      ...prev,
      customizationGroups: [
        ...prev.customizationGroups,
        {
          groupName: '',
          sortOrder: 1,
          fields: [
            {
              label: '',
              fieldType: 'text',
              isRequired: true,
              sortOrder: 1,
              allowedValues: '',
              minLength: '',
              maxLength: '',
            },
          ],
        },
      ],
    }));
  };

  const removeGroup = (index) => {
    setFormData((prev) => ({
      ...prev,
      customizationGroups: prev.customizationGroups.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedGroups = formData.customizationGroups.map(group => ({
      ...group,
      fields: group.fields.map(field => ({
        ...field,
        minLength: field.minLength && !isNaN(field.minLength) 
          ? Number(field.minLength) 
          : null,
        maxLength: field.maxLength && !isNaN(field.maxLength) 
          ? Number(field.maxLength) 
          : null,
      }))
    }));

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    // Required fields validation
    if (
      !formData.productName.trim() ||
      !formData.sku.trim() ||
      !formData.mrp ||
      !formData.sellingPrice ||
      !(String(formData.categoryId || '').trim()) ||
      !formData.stockQuantity.trim() 
    ) {
      alert('Product Name, SKU, MRP, Selling Price, Category ID और Stock Quantity भरना अनिवार्य है!');
      return;
    }

    const form = new FormData();

    // Normal fields
    Object.entries(formData).forEach(([key, value]) => {
      if (
        ![
          'newMedia',
          'keyPoints',
          'colors',
          'sizes',
          'letters',
          'customizationGroups',
        ].includes(key)
      ) {
        form.append(key, value || '');
      }
    });

    // Nested arrays as JSON strings
    form.append('keyPoints', JSON.stringify(formData.keyPoints));
    form.append('colors', JSON.stringify(formData.colors));
    form.append('sizes', JSON.stringify(formData.sizes));
    form.append('letters', JSON.stringify(formData.letters));
    form.append('customizationGroups', JSON.stringify(processedGroups));

    // New media
    formData.newMedia.forEach((file) => {
  if (file.type.startsWith('image/')) {
    form.append('productImages', file);
  } else if (file.type.startsWith('video/')) {
    form.append('productVideos', file);
  }
});
    // Removed media IDs (for update)
    if (isEditMode && removedMediaIds.length > 0) {
      form.append('removedMediaIds', JSON.stringify(removedMediaIds));
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/${editId}`, form, config);
        setSuccessMsg('Product updated successfully!');
      } else {
        await axios.post(API_BASE_URL, form, config);
        setSuccessMsg('Product created successfully!');
      }

      await fetchProducts();
      setShowFormModal(false);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Something went wrong while saving');
    }
  };

  const quickUpdateProduct = async (id, payload) => {
  try {
    setUpdatingId(id);
    const token = localStorage.getItem('token');

    await axios.patch(
      `${API_BASE_URL}/${id}/quick-update`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccessMsg('Product updated successfully');
    fetchProducts();
  } catch (err) {
    console.error(err);
    setError('Quick update failed');
  } finally {
    setUpdatingId(null);
  }
};

  const resetForm = () => {
    setFormData({
      productName: '',
      productTitle: '',
      categoryId: '',
      subcategoryId: '',
      sku: '',
      mrp: '',
      sellingPrice: '',
      discountPrice: '',
      status: 'active',
      shortDescription: '',
      productDescription: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      manufacturerName: '',
      countryOfOrigin: '',
      netQuantity: '',
      printingTime: '',
      material: '',
      stockQuantity: '0',

      keyPoints: [{ pointText: '', sortOrder: 1 }],
      colors: [{ colorName: '', colorCode: '', isActive: true }],
      sizes: [{ sizeName: '', sizeValue: '', isActive: true }],
      letters: [{ letter: '', price: '', isActive: true }],
      customizationGroups: [
        {
          groupName: '',
          sortOrder: 1,
          fields: [
            {
              label: '',
              fieldType: 'text',
              isRequired: true,
              sortOrder: 1,
              allowedValues: '',
              minLength: '',
              maxLength: '',
            },
          ],
        },
      ],
      newMedia: [],
    });
    setExistingMedia([]);
    setRemovedMediaIds([]);
    setIsEditMode(false);
    setEditId(null);
    setCurrentStep(1);
  };

  const handleEdit = (product) => {
    setFormData({
      productName: product.productName || '',
      productTitle: product.productTitle || '',
      categoryId: product.categoryId?.toString() || '',
      subcategoryId: product.subcategoryId?.toString() || '',
      sku: product.sku || '',
      mrp: product.mrp || '',
      sellingPrice: product.sellingPrice || '',
      discountPrice: product.discountPrice || '',
      status: product.status || 'active',
      shortDescription: product.shortDescription || '',
      productDescription: product.productDescription || '',
      length: product.length || '',
      width: product.width || '',
      height: product.height || '',
      weight: product.weight || '',
      manufacturerName: product.manufacturerName || '',
      countryOfOrigin: product.countryOfOrigin || '',
      netQuantity: product.netQuantity || '',
      printingTime: product.printingTime || '',
      material: product.material || '',
      stockQuantity: product.stockQuantity?.toString() || '0',

      keyPoints: product.keyPoints?.length
        ? product.keyPoints
        : [{ pointText: '', sortOrder: 1 }],
      colors: product.colors?.length
        ? product.colors
        : [{ colorName: '', colorCode: '', isActive: true }],
      sizes: product.sizes?.length
        ? product.sizes
        : [{ sizeName: '', sizeValue: '', isActive: true }],
      letters: product.letters?.length
        ? product.letters
        : [{ letter: '', price: '', isActive: true }],
      customizationGroups: product.customizationGroups?.length
        ? product.customizationGroups
        : [
            {
              groupName: '',
              sortOrder: 1,
              fields: [
                {
                  label: '',
                  fieldType: 'text',
                  isRequired: true,
                  sortOrder: 1,
                  allowedValues: '',
                  minLength: '',
                  maxLength: '',
                },
              ],
            },
          ],

      newMedia: [], // New files start empty
    });

    // Load existing media
    setExistingMedia(
      product.images?.map((img) => ({
        id: img.id,
        url: img.fileUrl,
        type: img.fileType || 'image', // Assume 'image' if not set
      })) || []
    );
    setRemovedMediaIds([]);

    setEditId(product.id || product.productId);
    setIsEditMode(true);
    const filtered = subcategories.filter(
      (sub) => String(sub.categoryId) === String(product.categoryId)
    );
    setFilteredSubcategories(filtered);

  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg('Product deleted successfully');
      fetchProducts();
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const stepNames = ['Basic Details', 'Variants', 'Customizations', 'Media']; // Updated to 'Media'

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="products" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Manage Products</h1>

        {error && <p className="text-red-600 dark:text-red-400 mb-4 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
        {successMsg && <p className="text-green-600 dark:text-green-400 mb-4 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">{successMsg}</p>}

        <button
          onClick={() => { resetForm(); setShowFormModal(true); }}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Add New Product
        </button>

        {/* Table */}
        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold">All Products ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                      <p className="mt-4">Loading products...</p>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id || product.productId} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4">{product.id || product.productId}</td>
                      <td className="px-6 py-4">{product.productName}</td>
                      <td className="px-6 py-4">{product.sku}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={product._newPrice ?? product.sellingPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProducts((prev) =>
                              prev.map((p) =>
                                p.id === product.id ? { ...p, _newPrice: val } : p
                              )
                            );
                          }}
                          className="w-20 border rounded p-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={product._newStock ?? product.stockQuantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProducts((prev) =>
                              prev.map((p) =>
                                p.id === product.id ? { ...p, _newStock: val } : p
                              )
                            );
                          }}
                          className="w-20 border rounded p-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={product._newStatus ?? product.status}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProducts((prev) =>
                              prev.map((p) =>
                                p.id === product.id ? { ...p, _newStatus: val } : p
                              )
                            );
                          }}
                          className="w-20 border rounded p-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 flex gap-4 items-center">
                        <button
                          onClick={() =>
                            quickUpdateProduct(product.id || product.productId, {
                              sellingPrice: product._newPrice ?? product.sellingPrice,
                              stockQuantity: product._newStock ?? product.stockQuantity,
                              status: product._newStatus ?? product.status,
                            })
                          }
                          disabled={updatingId === (product.id || product.productId)}
                          className="text-green-600 font-semibold hover:text-green-800"
                        >
                          {updatingId === (product.id || product.productId) ? 'Saving...' : 'Save'}
                        </button>

                        <button
                          onClick={() => {
                            handleEdit(product);
                            setShowFormModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelectedId(product.id || product.productId);
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

        {/* Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Update Product' : 'Add New Product'}</h2>

              {/* Step Indicators */}
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
                  <>
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Product Title</label>
                        <input
                          name="productTitle"
                          value={formData.productTitle}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>

                        <select
                          value={formData.categoryId}
                          onChange={handleCategorySelect}
                          required
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>


                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Subcategory <span className="text-red-500">*</span>
                        </label>

                        <select
                          value={formData.subcategoryId}
                          onChange={handleSubcategorySelect}
                          disabled={!formData.categoryId}
                          required
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                          <option value="">Select Subcategory</option>

                          {filteredSubcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.subCategoryName}
                            </option>
                          ))}
                        </select>
                      </div>


                      <div>
                        <label className="block text-sm font-medium mb-1">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          MRP <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="mrp"
                          type="number"
                          value={formData.mrp}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Selling Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="sellingPrice"
                          type="number"
                          value={formData.sellingPrice}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Discount Price</label>
                        <input
                          name="discountPrice"
                          type="number"
                          value={formData.discountPrice}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="stockQuantity"
                          type="number"
                          min="0"
                          value={formData.stockQuantity}
                          onChange={handleChange}
                          required
                          placeholder="Available stock (e.g. 100)"
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Additional Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                      <div>
                        <label className="block text-sm font-medium mb-1">Manufacturer Name</label>
                        <input
                          name="manufacturerName"
                          value={formData.manufacturerName}
                          onChange={handleChange}
                          placeholder="Manufacturer name"
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Country of Origin</label>
                        <input
                          name="countryOfOrigin"
                          value={formData.countryOfOrigin}
                          onChange={handleChange}
                          placeholder="Country of origin"
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Net Quantity</label>
                        <input
                          name="netQuantity"
                          value={formData.netQuantity}
                          onChange={handleChange}
                          placeholder="e.g. 500 ml, 1 kg"
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Printing Time</label>
                        <input
                          name="printingTime"
                          value={formData.printingTime}
                          onChange={handleChange}
                          placeholder="e.g. 2-3 days"
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Material</label>
                        <input
                          name="material"
                          value={formData.material}
                          onChange={handleChange}
                          placeholder="e.g. Cotton, Plastic, Wood"
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium mb-1">Short Description</label>
                      <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-medium mb-1">Product Description</label>
                      <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                      <div>
                        <label className="block text-sm font-medium mb-1">Length (cm)</label>
                        <input
                          name="length"
                          type="number"
                          value={formData.length}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Width (cm)</label>
                        <input
                          name="width"
                          type="number"
                          value={formData.width}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                        <input
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Weight (kg/g)</label>
                        <input
                          name="weight"
                          type="number"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* Colors */}
                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Colors</h3>
                        <button
                          type="button"
                          onClick={() =>
                            addSimpleItem('colors', { colorName: '', colorCode: '', isActive: true })
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          + Add Color
                        </button>
                      </div>
                      {formData.colors.map((color, idx) => (
                        <div key={idx} className="flex flex-wrap gap-4 mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                          <input
                            value={color.colorName}
                            onChange={(e) => updateSimpleArray('colors', idx, 'colorName', e.target.value)}
                            placeholder="Color Name"
                            className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <input
                            value={color.colorCode}
                            onChange={(e) => updateSimpleArray('colors', idx, 'colorCode', e.target.value)}
                            placeholder="#000000"
                            className="w-32 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <label className="flex items-center gap-2">
                            Active
                            <input
                              type="checkbox"
                              checked={color.isActive}
                              onChange={(e) =>
                                updateSimpleArray('colors', idx, 'isActive', e.target.checked)
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSimpleItem('colors', idx)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Sizes */}
                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Sizes</h3>
                        <button
                          type="button"
                          onClick={() =>
                            addSimpleItem('sizes', { sizeName: '', sizeValue: '', isActive: true })
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          + Add Size
                        </button>
                      </div>
                      {formData.sizes.map((size, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap gap-4 mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                          <input
                            value={size.sizeName}
                            onChange={(e) => updateSimpleArray('sizes', idx, 'sizeName', e.target.value)}
                            placeholder="Size Name (S, M, L...)"
                            className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <input
                            value={size.sizeValue}
                            onChange={(e) => updateSimpleArray('sizes', idx, 'sizeValue', e.target.value)}
                            placeholder="e.g. 42, XL"
                            className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <label className="flex items-center gap-2">
                            Active
                            <input
                              type="checkbox"
                              checked={size.isActive}
                              onChange={(e) =>
                                updateSimpleArray('sizes', idx, 'isActive', e.target.checked)
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSimpleItem('sizes', idx)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Letters */}
                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Letters</h3>
                        <button
                          type="button"
                          onClick={() =>
                            addSimpleItem('letters', { letter: '', price: '', isActive: true })
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          + Add Letter
                        </button>
                      </div>
                      {formData.letters.map((letter, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap gap-4 mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                          <input
                            value={letter.letter}
                            onChange={(e) => updateSimpleArray('letters', idx, 'letter', e.target.value)}
                            placeholder="Letter (e.g. A, B)"
                            className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <input
                            value={letter.price}
                            onChange={(e) => updateSimpleArray('letters', idx, 'price', e.target.value)}
                            placeholder="Price"
                            className="w-32 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <label className="flex items-center gap-2">
                            Active
                            <input
                              type="checkbox"
                              checked={letter.isActive}
                              onChange={(e) =>
                                updateSimpleArray('letters', idx, 'isActive', e.target.checked)
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSimpleItem('letters', idx)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    {/* Key Points */}
                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Key Points</h3>
                        <button
                          type="button"
                          onClick={() => addSimpleItem('keyPoints', { pointText: '', sortOrder: 1 })}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          + Add Point
                        </button>
                      </div>
                      {formData.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex gap-4 mb-4 items-center">
                          <input
                            value={point.pointText}
                            onChange={(e) =>
                              updateSimpleArray('keyPoints', idx, 'pointText', e.target.value)
                            }
                            placeholder="e.g. 100% Cotton, Washable"
                            className="flex-1 border rounded p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => removeSimpleItem('keyPoints', idx)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Customization Groups */}
                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Customization Groups</h3>
                        <button
                          type="button"
                          onClick={addGroup}
                          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          + Add Group
                        </button>
                      </div>

                      {formData.customizationGroups.map((group, gIdx) => (
                        <div key={gIdx} className="mb-6 p-5 border rounded-xl bg-gray-50 dark:bg-gray-700">
                          <div className="flex justify-between items-center mb-4">
                            <input
                              value={group.groupName}
                              onChange={(e) => updateGroup(gIdx, 'groupName', e.target.value)}
                              placeholder="Group Name (e.g. Engraving Style)"
                              className="flex-1 border rounded-lg p-3 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeGroup(gIdx)}
                              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                              Remove Group
                            </button>
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Fields</h4>
                            <button
                              type="button"
                              onClick={() => addField(gIdx)}
                              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                            >
                              + Add Field
                            </button>
                          </div>

                          {group.fields.map((field, fIdx) => (
                            <div
                              key={fIdx}
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border"
                            >
                              {/* Label */}
                              <input
                                value={field.label}
                                onChange={(e) => updateField(gIdx, fIdx, 'label', e.target.value)}
                                placeholder="Label"
                                className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />

                              {/* Field Type */}
                              <select
                                value={field.fieldType}
                                onChange={(e) => updateField(gIdx, fIdx, 'fieldType', e.target.value)}
                                className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="checkbox">Checkbox</option>
                              </select>

                              {/* Allowed Values */}
                              <input
                                value={field.allowedValues}
                                onChange={(e) => updateField(gIdx, fIdx, 'allowedValues', e.target.value)}
                                placeholder="Options (comma separated)"
                                className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />

                              {/* minLength & maxLength */}
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={field.minLength ?? ''}
                                  onChange={(e) => updateField(gIdx, fIdx, 'minLength', e.target.value)}
                                  placeholder="Min Length"
                                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  value={field.maxLength ?? ''}
                                  onChange={(e) => updateField(gIdx, fIdx, 'maxLength', e.target.value)}
                                  placeholder="Max Length"
                                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>

                              {/* Required + Remove */}
                              <div className="flex items-center justify-between gap-4">
                                <label className="flex items-center gap-2 whitespace-nowrap">
                                  Required
                                  <input
                                    type="checkbox"
                                    checked={field.isRequired}
                                    onChange={(e) => updateField(gIdx, fIdx, 'isRequired', e.target.checked)}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeField(gIdx, fIdx)}
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}

{currentStep === 4 && (
  <>
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4">Product Media (Images & Videos)</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Images Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Upload Images (jpg, png, webp)
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleMediaUpload}
            className="block w-full text-sm text-gray-500 
                       file:mr-4 file:py-3 file:px-6 file:rounded-lg 
                       file:border-0 file:text-sm file:font-semibold 
                       file:bg-blue-50 file:text-blue-700 
                       hover:file:bg-blue-100 
                       dark:file:bg-gray-700 dark:file:text-gray-200 
                       dark:hover:file:bg-gray-600
                       border border-gray-300 dark:border-gray-600 rounded-lg p-2"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max 10 images recommended
          </p>
        </div>

        {/* Videos Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Upload Videos (mp4, webm, mov)
          </label>
        <input
            type="file"
            multiple
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleMediaUpload}
            className="block w-full text-sm text-gray-500 
                       file:mr-4 file:py-3 file:px-6 file:rounded-lg 
                       file:border-0 file:text-sm file:font-semibold 
                       file:bg-purple-50 file:text-purple-700 
                       hover:file:bg-purple-100 
                       dark:file:bg-gray-700 dark:file:text-gray-200 
                       dark:hover:file:bg-gray-600
                       border border-gray-300 dark:border-gray-600 rounded-lg p-2"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max 5 videos recommended (short clips preferred)
          </p>
        </div>
      </div>

      {/* Preview Section */}
      {(existingMedia.length > 0 || formData.newMedia.length > 0) && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-3">Media Preview</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Existing Media */}
            {existingMedia.map((media, idx) => (
              <div key={`existing-${media.id}`} className="relative group">
                {media.type === 'video' ? (
                  <video
                    src={`${BASE_MEDIA_URL}${media.url}`}
                    controls
                    className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-700 shadow-sm"
                  />
                ) : (
                  <img
                    src={`${BASE_MEDIA_URL}${media.url}`}
                    alt="Existing media"
                    className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-700 shadow-sm"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeExistingMedia(media.id, idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs opacity-90 hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}

            {/* New Media Previews */}
            {formData.newMedia.map((file, idx) => (
              <div key={`new-${idx}`} className="relative group">
                {file.type?.startsWith('video/') ? (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-700 shadow-sm"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New media preview"
                    className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-700 shadow-sm"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeNewMedia(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs opacity-90 hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
)}

                <div className="flex justify-end gap-4 mt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentStep((prev) => prev + 1);
                      }}
                      className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
                    >
                      {isEditMode ? 'Update Product' : 'Add Product'}
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

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Are you sure you want to delete this product? This action cannot be undone.
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