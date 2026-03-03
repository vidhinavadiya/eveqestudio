import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        };

        const [res1, res2] = await Promise.all([
          axios.get('http://localhost:5000/api/coupon/all').catch(e => ({ data: { data: [] } })),
          axios.get('http://localhost:5000/api/bxgy-coupon', config).catch(e => ({ data: { coupons: [] } }))
        ]);

        let msgs = [];

        const standardData = res1.data.data || res1.data || [];
        if (Array.isArray(standardData)) {
          standardData.filter(c => c.isActive).forEach(c => {
            msgs.push(`${c.discountType === 'percentage' ? c.discountValue + '%' : '₹' + c.discountValue} OFF | CODE: ${c.code}`);
          });
        }

        const bxgyData = res2.data.coupons || [];
        if (Array.isArray(bxgyData)) {
          bxgyData.filter(c => c.active).forEach(c => {
            const desc = c.description ? c.description.toUpperCase() : `BUY ${c.buyQuantity} GET ${c.freeQuantity} FREE`;
            msgs.push(`${desc} | CODE: ${c.code}`);
          });
        }

        if (msgs.length > 0) {
          setAnnouncements(msgs);
        } else {
          setAnnouncements([
            "Welcome to 3D Printer Hub! 🚀",
            "Free Shipping on orders above ₹199 ✨"
          ]);
        }
      } catch (err) {
        console.error("Critical Error in AnnouncementBar:", err);
        setAnnouncements(["Best Quality Custom 3D Gifts 🔥"]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % announcements.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [announcements]);

  if (loading || announcements.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-800 via-gray-900 to-slate-950 text-white h-10 md:h-11 flex items-center justify-center shadow-md z-[9999] border-b border-slate-700/60">
      {/* Metallic shine – slow for professional feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine-slow pointer-events-none"></div>

      {/* Subtle glow accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-96 h-12 bg-blue-600/10 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      <div
        key={index}
        className="relative flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 text-xs sm:text-sm font-bold tracking-wide uppercase animate-fade-slide w-full max-w-4xl mx-auto"
      >
        <span className="bg-blue-700/90 text-white px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-extrabold shadow-sm animate-pulse-fast whitespace-nowrap">
          LIVE OFFER
        </span>

        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 animate-text-shine text-center flex-1 truncate">
          {announcements[index]}
        </span>

        {/* <span className="text-base sm:text-lg animate-bounce-slow hidden sm:inline">⚡</span> */}
      </div>

      {/* Fade edges – zyada prominent mobile pe */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none"></div>
    </div>
  );
}