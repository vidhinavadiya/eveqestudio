// src/pages/admin/faq/Faqs.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../../components/admin/AdminSidebar";

export default function Faqs({ onLogout }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    isActive: true,
  });

  const [editForm, setEditForm] = useState({
    question: "",
    answer: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000/api/faqs/admin";

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaqs(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchFaqs();
  }, [token]);

  // Add FAQ
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      return setError("Question and Answer are required");
    }

    try {
      const res = await axios.post(API, newFaq, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaqs([res.data.data, ...faqs]);
      setShowAddModal(false);
      setNewFaq({ question: "", answer: "", isActive: true });
      setSuccessMsg("FAQ added successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add FAQ");
    }
  };

  // Update FAQ
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.put(`${API}/${selectedFaq.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaqs(faqs.map((f) => (f.id === selectedFaq.id ? res.data.data : f)));
      setShowEditModal(false);
      setSuccessMsg("FAQ updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update FAQ");
    }
  };

  // Delete FAQ
  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/${selectedFaq.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaqs(faqs.filter((f) => f.id !== selectedFaq.id));
      setShowDeleteModal(false);
      setSuccessMsg("FAQ deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete FAQ");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminSidebar active="faqs" onLogout={onLogout} />

      <main className="flex-1 md:ml-72 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
          Manage FAQs
        </h1>

        {error && (
          <p className="mb-6 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="mb-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50">
            {successMsg}
          </p>
        )}

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-8 px-8 py-3 rounded-xl font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md hover:shadow-lg"
        >
          + Add New FAQ
        </button>

        {/* FAQs Table */}
        <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              All FAQs ({faqs.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Question</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading FAQs...</p>
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No FAQs found. Add your first FAQ.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq) => (
                    <tr
                      key={faq.id}
                      className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{faq.id}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-200 line-clamp-2 max-w-md">
                        {faq.question}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            faq.isActive
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50"
                          }`}
                        >
                          {faq.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-5">
                        <button
                          onClick={() => {
                            setSelectedFaq(faq);
                            setEditForm({
                              question: faq.question,
                              answer: faq.answer,
                              isActive: faq.isActive,
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFaq(faq);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition"
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
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Add New FAQ</h2>

            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="e.g. What is a 3D printer?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer *
                </label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Detailed answer here..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={newFaq.isActive}
                    onChange={(e) => setNewFaq({ ...newFaq, isActive: e.target.checked })}
                    className="h-5 w-5 accent-black dark:accent-white"
                  />
                  Active
                </label>
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
                  Add FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedFaq && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all animate-fadeIn">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Edit FAQ</h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer *
                </label>
                <textarea
                  value={editForm.answer}
                  onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="h-5 w-5 accent-black dark:accent-white"
                  />
                  Active
                </label>
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
                  Update FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFaq && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Are you sure you want to delete this FAQ?<br />
              <strong className="text-black dark:text-white">"{selectedFaq.question.substring(0, 60)}..."</strong><br />
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