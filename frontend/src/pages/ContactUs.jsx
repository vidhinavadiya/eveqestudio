// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactUs({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    // Simulate form submission (replace with real API later)
    setTimeout(() => {
      setSubmitted(true);
      setError('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />

      {/* Hero Section – same style as About/Home */}
      <section className="relative pt-24 pb-32 px-6 md:px-12 lg:px-24 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070')"
          }}
        />
        <div className="absolute inset-0 bg-black/80 dark:bg-black/85"></div>

        <div className="relative max-w-5xl mx-auto z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fadeUp animation-delay-300">
            Contact Us
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fadeUp animation-delay-500">
            Have questions? Want to collaborate or place a bulk/custom order?  
            We're here to help — reach out anytime!
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 animate-fadeUp">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">Email Us</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  support@3dprinterhub.com<br />
                  sales@3dprinterhub.com
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 animate-fadeUp animation-delay-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">Visit Us</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  123 Tech Park, Vesu,<br />
                  Surat, Gujarat 395007, India
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 animate-fadeUp animation-delay-400">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">Call Us</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  +91 98765 43210<br />
                  Mon–Sat: 10:00 AM – 7:00 PM
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-12 shadow-md animate-fadeIn">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your message has been sent successfully. We'll get back to you soon!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (optional) */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-12 animate-fadeUp">
            Find Us Here
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-fadeIn">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.234567890123!2d72.785678!3d21.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3957b2c4a5b6c7d1%3A0x8f9a0b1c2d3e4f5g!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1699999999999"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            />
          </div>
        </div>
      </section>
          <Footer />
      {/* Animations – same as other pages */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-fadeUp { animation: fadeUp 1s ease-out forwards; }
        .animate-pulseSlow { animation: pulseSlow 3s ease-in-out infinite; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
}