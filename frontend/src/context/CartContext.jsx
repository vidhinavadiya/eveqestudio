import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    id: null,
    items: [],
    subtotal: 0,
    shippingCharge: 0,
    couponDiscountAmount: 0,
    totalAmount: 0,
    appliedCoupon: null,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.data || res.data);
    } catch (err) {
      console.error('Cart fetch error:', err);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (data) => {
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart();
      toast.success('Product added to cart!');
    } catch (err) {
      console.error('Add error:', err);
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await axios.put(  // ← POST ki jagah PUT
        'http://localhost:5000/api/cart/update-quantity',
        { cartItemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      toast.success('Quantity updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(  // ← POST ki jagah DELETE
        'http://localhost:5000/api/cart/remove-item',
        { 
          data: { cartItemId },  // DELETE request mein body bhej sakte ho
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      await fetchCart();
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Remove failed');
    }
  };

// CartContext.js mein applyCoupon function ko aise badlein:
const applyCoupon = async (code, extraData = {}) => { // 👈 extraData add kiya
  if (!token) {
    toast.error('Please login first');
    return;
  }

  try {
    const cartId = cart?.id;
    if (!cartId) throw new Error('Cart ID not found');

    const res = await axios.post(
      'http://localhost:5000/api/coupon/apply',
      { 
        code: code.trim().toUpperCase(),
        cartId,
        ...extraData // 👈 Yeh selectedFreeProductId ko payload mein bhej dega
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchCart(); // 👈 Yeh sabse important hai, cart refresh karega
    toast.success('Coupon applied!');
    return res.data;
  } catch (err) {
    console.error('Apply coupon error:', err.response?.data);
    throw err; // Taaki BXGY component ko error pata chale
  }
};

const removeCoupon = async () => {
  try {
    const cartId = cart?.id;

    if (!cartId) {
      throw new Error('Cart ID not found');
    }

    await axios.post(
      'http://localhost:5000/api/coupon/remove',
      { cartId },   // 🔥 cartId bhejna zaruri hai
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchCart();
    toast.success('Coupon removed');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to remove coupon');
  }
};


  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);