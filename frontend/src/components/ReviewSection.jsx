import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:5000";

export default function ReviewSection({ product }) {
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
const reviewsPerPage = 5;
  // Fetch Reviews
  useEffect(() => {
    if (!product?.productId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/reviews/product/${product.productId}`
        );
        setReviews(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [product?.productId]);

  // Submit Review
  const handleSubmit = async () => {
    if (!rating) return alert("Please select rating");
    if (!token) return alert("Please login to write a review");

    setLoading(true);
    setCurrentPage(1);
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const formData = new FormData();
      formData.append("productId", product.productId);
      formData.append("userId", userId);
      formData.append("rating", rating);
      formData.append("comment", comment);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const res = await axios.post(
        `${BASE_URL}/api/reviews`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setReviews([res.data.data, ...reviews]);
      setShowPopup(false);
      setRating(0);
      setComment("");
      setImages([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

      const indexOfLastReview = currentPage * reviewsPerPage;
      const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
      const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  return (
<div className="mt-16 px-4 md:px-12 lg:px-24 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Customer Reviews</h2>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex text-amber-400 text-2xl">
              {"★".repeat(Math.round(averageRating))}
              <span className="text-slate-300 dark:text-slate-700">
                {"★".repeat(5 - Math.round(averageRating))}
              </span>
            </div>
            <span className="text-lg font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              {averageRating} <span className="text-slate-500 font-normal">({reviews.length} reviews)</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowPopup(true)}
          className="w-full md:w-auto px-8 py-3.5 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40"
        >
          Write a Review
        </button>
      </div>

      <hr className="border-slate-200 dark:border-slate-800 mb-10" />

      {/* Review List */}
      <div className="space-y-10">
        {reviews.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400 italic">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
    currentReviews.map((rev) => (
              <div
              key={rev.id}
              className="group pb-10 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {(rev.user?.username || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex text-amber-400 text-sm mb-0.5">
                    {"★".repeat(rev.rating)}
                    <span className="text-slate-300 dark:text-slate-700">{"★".repeat(5 - rev.rating)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {rev.user?.username || "Anonymous"}
                    </span>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      • {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg pl-1">
                {rev.comment}
              </p>

              {/* Review Images */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-6">
                  {rev.images.map((img) => (
                    <img
                      key={img.id}
                      src={`${BASE_URL}${img.fileUrl}`}
                      alt="Review attachment"
                      className="w-28 h-28 object-cover rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-zoom-in"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
{/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-10">

    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded-md border disabled:opacity-50"
    >
      ‹
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-4 py-1 rounded-md border ${
          currentPage === index + 1
            ? "bg-indigo-600 text-white"
            : "bg-white dark:bg-slate-800"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded-md border disabled:opacity-50"
    >
      ›
    </button>

  </div>
)}
      {/* Write Review Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full relative shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors text-2xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-black mb-1 text-center dark:text-white">
              Write a Review
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6">
              How was your experience with this product?
            </p>

            {/* Product Mini Preview */}
            {product?.images?.[0]?.fileUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={`${BASE_URL}${product.images[0].fileUrl}`}
                  alt={product.productName}
                  className="w-20 h-20 object-cover rounded-2xl shadow-xl ring-4 ring-slate-50 dark:ring-slate-800"
                />
              </div>
            )}

            {/* Rating Stars */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-5xl transition-all hover:scale-110 active:scale-90 ${
                    rating >= star
                      ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                      : "text-slate-200 dark:text-slate-800"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment Input */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="What did you like or dislike?"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all mb-4 resize-none"
            />

            {/* Image Upload Input */}
            <div className="mb-8">
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                Add Photos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-slate-300"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 py-4 font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!rating || loading}
                className="flex-1 py-4 font-bold bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all"
              >
                {loading ? "Posting..." : "Post Review"}
              </button>
            </div>
            
          </div>
          
          
        </div>
        
      )}
    </div>
  );
}