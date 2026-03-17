import React, { useEffect, useState } from "react";
import axios from "axios";

export default function IncludedAddons({ productId }) {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    if (!productId) return;

    const fetchAddons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/link/public");
        const allAddons = res.data.data || [];
        const filtered = allAddons.filter(
          (addon) => String(addon.productId) === String(productId)
        );
        setAddons(filtered);
      } catch (err) {
        console.error("Failed to load addons", err);
      }
    };

    fetchAddons();
  }, [productId]);

  if (!addons.length) return null;

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-gray-900 dark:text-white">
        Included Add-Ons
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {addons.map((addon) => {
          const points = Array.isArray(addon.points) ? addon.points : [];
          const links = Array.isArray(addon.supportLinks) ? addon.supportLinks : [];

          return (
            <div
              key={addon.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm 
                         hover:shadow-lg hover:scale-[1.03] hover:border-gray-300 dark:hover:border-gray-600 
                         transition-all duration-300 ease-out cursor-pointer w-[280px]"
            >
              {/* Image Box */}
              {addon.image && (
                <div className="w-full h-[180px] mb-3 overflow-hidden rounded">
                  <img
                    src={`http://localhost:5000/uploads/product-addons/${addon.image}`}
                    alt={addon.title}
                    className="w-full h-full object-cover transition-transform duration-500 
                               group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content Area */}
              <div className="overflow-y-auto">
                <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">
                  {addon.title}
                </h3>

                {/* KEY POINTS */}
                {points.length > 0 && (
                  <div className="mb-4">
                    <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 text-sm">
                      {points.map((point) => (
                        <li key={point.id}>{point.point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SUPPORT LINKS */}
                {links.length > 0 && (
                  <div>
                    <p className="font-medium mb-2 text-gray-900 dark:text-gray-200 text-sm">
                      Supports:
                    </p>
                    <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 text-sm">
                      {links.map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.link}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}