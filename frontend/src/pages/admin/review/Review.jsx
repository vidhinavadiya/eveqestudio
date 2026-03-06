import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function Review({ onLogout }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [newImages, setNewImages] = useState([]);
  const [editImages, setEditImages] = useState([]);
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
}, [token]); // token yahan zaruri hai

  const [newReview, setNewReview] = useState({
    userId: '',
    productId: '',
    rating: 1,
    comment: ''
  });

  // Edit form updated with all fields
  const [editForm, setEditForm] = useState({
    userId: '',
    productId: '',
    rating: 1,
    comment: ''
  });

  // Fetch All Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

if (token) {
  fetchReviews();
  fetchProducts();
}  }, [token, fetchProducts]);

  // Handle Add Review
const handleAddReview = async (e) => {
  e.preventDefault();
  setError('');
  setSuccessMsg('');

  try {
    const formData = new FormData();
    formData.append("userId", newReview.userId);
    formData.append("productId", newReview.productId);
    formData.append("rating", newReview.rating);
    formData.append("comment", newReview.comment);

    // append images
    for (let i = 0; i < newImages.length; i++) {
      formData.append("images", newImages[i]);
    }

    const res = await axios.post(
      'http://localhost:5000/api/reviews',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setReviews([res.data.data, ...reviews]);
    setShowAddModal(false);
    setNewReview({ userId: '', productId: '', rating: 1, comment: '' });
    setNewImages([]);
    setSuccessMsg('Review added successfully!');

  } catch (err) {
    setError(err.response?.data?.message || 'Add failed');
  }
};

  // Handle Update Review
const handleUpdate = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const formData = new FormData();
    formData.append("userId", editForm.userId);
    formData.append("productId", editForm.productId);
    formData.append("rating", editForm.rating);
    formData.append("comment", editForm.comment);

    for (let i = 0; i < editImages.length; i++) {
      formData.append("images", editImages[i]);
    }

    const res = await axios.put(
      `http://localhost:5000/api/reviews/${selectedReview.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setReviews(reviews.map(r =>
      r.id === selectedReview.id ? res.data.data : r
    ));

    setShowEditModal(false);
    setEditImages([]);
    setSuccessMsg('Review updated successfully!');

  } catch (err) {
    setError(err.response?.data?.message || 'Update failed');
  }
};

  // Handle Delete Review
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/${selectedReview.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviews.filter(r => r.id !== selectedReview.id));
      setShowDeleteModal(false);
      setSuccessMsg('Review deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  // Reusable Input Component for Modals to maintain clean code
  const ModalInput = ({ label, type = "text", value, onChange, min, max, required = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="reviews" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <h1 className="text-4xl font-bold mb-8">Manage Reviews</h1>

        {error && <p className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">{error}</p>}
        {successMsg && <p className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mb-4">{successMsg}</p>}

        <button
          onClick={() => setShowAddModal(true)}
          className="mb-6 px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-xl shadow-lg hover:opacity-80 transition-all font-semibold"
        >
          + Add Review
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold">All Reviews ({reviews.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Images</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
  {loading ? (
    <tr>
      <td colSpan="7" className="text-center py-10">
        Loading...
      </td>
    </tr>
  ) : reviews.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center py-10 text-gray-500">
        No reviews found.
      </td>
    </tr>
  ) : (
    reviews.map((review) => (
      <tr key={review.id}>
        <td className="px-6 py-4">{review.id}</td>

        <td className="px-6 py-4">
          {review.user?.username || review.userId}
        </td>

        <td className="px-6 py-4">
          {
            products.find(p => p.productId === review.productId)?.productName
            || review.productId
          }
        </td>

        <td className="px-6 py-4 text-yellow-500">
          ⭐ {review.rating}
        </td>

        <td className="px-6 py-4 max-w-xs truncate">
          {review.comment}
        </td>

        <td className="px-6 py-4">
          {review.images && review.images.length > 0 ? (
            <div className="flex gap-2">
              {review.images.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:5000${img.fileUrl}`}
                  alt="review"
                  className="w-12 h-12 object-cover rounded"
                />
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No Images</span>
          )}
        </td>

        <td className="px-6 py-4 flex gap-4">
          <button
            onClick={() => {
              setSelectedReview(review);
              setEditForm({
                userId: review.userId,
                productId: review.productId,
                rating: review.rating,
                comment: review.comment || ''
              });
              setShowEditModal(true);
            }}
            className="text-blue-500"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setSelectedReview(review);
              setShowDeleteModal(true);
            }}
            className="text-red-500"
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

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Review</h2>
            <form onSubmit={handleAddReview}>
              <ModalInput 
                label="User ID" 
                type="number" 
                value={newReview.userId} 
                onChange={(e) => setNewReview({ ...newReview, userId: e.target.value })} 
                required 
              />
              <div className="mb-4">
  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
    Select Product *
  </label>

  <select
    value={newReview.productId}
    onChange={(e) =>
      setNewReview({
        ...newReview,
        productId: Number(e.target.value)
      })
    }
    className="w-full px-4 py-2 rounded-lg border border-gray-300 
               dark:border-gray-700 bg-white dark:bg-gray-800 
               text-gray-900 dark:text-white 
               focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
    required
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
              <ModalInput 
                label="Rating (1-5)" 
                type="number" 
                min="1" 
                max="5" 
                value={newReview.rating} 
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} 
                required 
              />
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
              </div>
              <div className="mb-6">
  <label className="block text-sm font-medium mb-1">
    Upload Images (Max 6)
  </label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => setNewImages(e.target.files)}
    className="w-full"
  />
</div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-black dark:bg-white dark:text-black text-white rounded-xl font-bold hover:opacity-90">Add Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (All Fields Editable) --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Review</h2>
            <form onSubmit={handleUpdate}>
              <ModalInput 
                label="User ID" 
                type="number" 
                value={editForm.userId} 
                onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })} 
                required 
              />
              <div className="mb-4">
  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
    Select Product *
  </label>

  <select
    value={editForm.productId}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        productId: Number(e.target.value)
      })
    }
    className="w-full px-4 py-2 rounded-lg border border-gray-300 
               dark:border-gray-700 bg-white dark:bg-gray-800 
               text-gray-900 dark:text-white 
               focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
    required
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
              <ModalInput 
                label="Rating (1-5)" 
                type="number" 
                min="1" 
                max="5" 
                value={editForm.rating} 
                onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} 
                required 
              />
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Comment</label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
              </div>
              <div className="mb-6">
  <label className="block text-sm font-medium mb-1">
    Update Images (optional)
  </label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => setEditImages(e.target.files)}
    className="w-full"
  />
</div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Update Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Delete Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}