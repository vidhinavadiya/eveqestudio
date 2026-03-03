// src/pages/AboutUs.jsx
import React from 'react';
import Navbar from '../components/Navbar'; // Assuming your Navbar is here
import Footer from '../components/Footer';

export default function AboutUs({ isLoggedIn, onLogout, darkMode, toggleDarkMode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 px-6 md:px-12 lg:px-24 text-center overflow-hidden animate-fadeIn">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070')" }}
        />
        <div className="absolute inset-0 bg-black/70 dark:bg-black/80"></div>

        <div className="relative max-w-5xl mx-auto z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fadeUp animation-delay-300">
            About 3D Printer Hub
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fadeUp animation-delay-500">
            We are a leading provider of premium 3D printers, filaments, accessories, and custom printing solutions. 
            Our mission is to empower creators, makers, and innovators with cutting-edge technology.
          </p>
          <button className="px-8 py-4 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulseSlow">
            Explore Products
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-950 animate-fadeIn animation-delay-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-12 animate-fadeUp">
            Our Premium 3D Printers & Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: 'Ender 3 V2',
                desc: 'Affordable and reliable FDM printer with high precision. Perfect for beginners and pros. Build volume: 220x220x250mm. Price: ₹15,000.',
                img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: 'Prusa i3 MK3S+',
                desc: 'Advanced FDM printer with auto-bed leveling and silent operation. Ideal for detailed prints. Build volume: 250x210x210mm. Price: ₹35,000.',
                img: 'https://images.unsplash.com/photo-1581093458791-9f979ddcfa1e?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: 'Formlabs Form 3',
                desc: 'SLA resin printer for high-resolution prototypes. Excellent for jewelry and dental models. Build volume: 145x145x185mm. Price: ₹2,50,000.',
                img: 'https://images.unsplash.com/photo-1581093588401-e3995afeaece?auto=format&fit=crop&q=80&w=800'
              }
            ].map((product, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fadeUp"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                <img 
                  src={product.img} 
                  alt={product.title} 
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {product.desc}
                  </p>
                  <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ordering Process Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white dark:bg-black animate-fadeIn animation-delay-1000">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-12 animate-fadeUp">
            How to Order from 3D Printer Hub
          </h2>

          <div className="space-y-12">
            {[
              {
                step: 1,
                title: 'Browse & Select Products',
                desc: 'Explore our wide range of 3D printers, filaments, and accessories. Add items to your cart.',
                img: 'https://images.unsplash.com/photo-1581093450021-1b3ce408f6a4?auto=format&fit=crop&q=80&w=800'
              },
              {
                step: 2,
                title: 'Customize & Checkout',
                desc: 'Choose custom options if available, enter shipping details, and proceed to secure payment.',
                img: 'https://images.unsplash.com/photo-1581093588411-d60a88fcacda?auto=format&fit=crop&q=80&w=800'
              },
              {
                step: 3,
                title: 'Track & Receive',
                desc: 'Get real-time tracking updates. Your order arrives safely with our premium packaging.',
                img: 'https://images.unsplash.com/photo-1581093458791-9f979ddcfa1e?auto=format&fit=crop&q=80&w=800'
              }
            ].map((step, i) => (
              <div 
                key={i} 
                className="flex flex-col md:flex-row items-center gap-8 animate-fadeUp"
                style={{ animationDelay: `${(i + 1) * 300}ms` }}
              >
                <div className="w-full md:w-1/2">
                  <img 
                    src={step.img} 
                    alt={`Step ${step.step}`} 
                    className="rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-2xl shadow-md">
                      {step.step}
                    </span>
                    <h3 className="text-2xl font-semibold text-black dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 md:px-12 lg:px-24 text-center bg-gray-50 dark:bg-gray-950 animate-fadeIn animation-delay-1300">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-4 animate-fadeUp">
          Ready to Start Your 3D Printing Journey?
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fadeUp animation-delay-200">
          Join thousands of creators using our premium products. Contact us for custom solutions.
        </p>
        <button className="px-8 py-4 rounded-xl font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulseSlow">
          Contact Us
        </button>
      </section>
          <Footer />
      {/* Animations */}
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
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1300 { animation-delay: 1300ms; }
      `}</style>
    </div>
  );
}