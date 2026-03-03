import React from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

// Humne API_BASE ko yahan rakha hai
const API_BASE = "http://localhost:5000";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

const getImageUrl = (item) => {
  if (!item) return 'https://via.placeholder.com/150';

  const path = 
    item.productImage || 
    item.image || 
    (item.product?.images?.[0]?.fileUrl) || 
    (item.productId?.images?.[0]?.fileUrl);

  if (!path) {
    console.warn("No path found for:", item.productName, item);
    return 'https://via.placeholder.com/150';
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Yahan http://localhost:5000 ki jagah API_BASE use karein
  return `${API_BASE}${cleanPath}`; 
};

  const handleIncrease = async () => {
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrease = async () => {
    if (item.quantity <= 1) return;
    try {
      await updateQuantity(item.id, item.quantity - 1);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(item.id);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">
{/* Product Image Section */}
<div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600">
  <img 
    src={getImageUrl(item)} 
    alt={item.productName || "product"}
    className="w-full h-full object-cover" 
    onError={(e) => { 
      console.log("Image fail for item:", item.productName);
      e.target.src = 'https://placehold.co/150?text=No+Image'; 
    }}
  />
</div>

      {/* Product Details */}
      <div className="flex-1 space-y-3">
        <div>
          {item.isFree && (
            <span className="text-green-600 font-bold text-sm uppercase tracking-wider block mb-1">
              FREE ITEM 🎁
            </span>
          )}

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.productName}
          </h3>
        </div>

        {/* Selected Options */}
        <div className="mt-1 flex flex-wrap gap-2">
    {item.selectedColor && (
      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[11px] font-medium rounded-md text-gray-600 dark:text-gray-400">
        Color: <span className="text-gray-900 dark:text-white">{item.selectedColor}</span>
      </span>
    )}
    {item.selectedSize && (
      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[11px] font-medium rounded-md text-gray-600 dark:text-gray-400">
        Size: <span className="text-gray-900 dark:text-white">{item.selectedSize}</span>
      </span>
    )}
    {item.selectedLetters && (
      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-[11px] font-medium rounded-md text-indigo-600 dark:text-indigo-400">
        Letter: <span className="font-bold">{item.selectedLetters}</span>
      </span>
    )}
  </div>
        {/* Customizations */}
        {item.customizations?.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <p className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">Customizations:</p>
            {item.customizations.map((c, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
                {c.groupName} → {c.fieldLabel}: {c.userValue}
              </p>
            ))}
          </div>
        )}

        {/* Price Details */}
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p>Base Price: ₹{item.basePrice?.toFixed(2) || "0.00"}</p>
          {item.customizationPrice > 0 && (
            <p>Customization: ₹{item.customizationPrice.toFixed(2)}</p>
          )}
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center border dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
            >
              −
            </button>
            <span className="px-4 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 text-sm font-bold uppercase transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right md:w-40">
        <p className="text-xl font-extrabold text-gray-900 dark:text-white">
          ₹{item.itemTotal?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  );
}