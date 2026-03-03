import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function ProductFaqSection({ darkMode }) {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/faqs/public`);
        setFaqs(res.data.data || []);
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading FAQs...
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-14">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {faq.question}
              <span className="text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}