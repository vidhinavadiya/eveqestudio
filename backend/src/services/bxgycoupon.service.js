// const BXGYCouponRepository = require('../repositories/bxgycoupon.repository');
// const { cart, cartitem, Product, ProductImage } = require('../database/models');

// class BXGYCouponService {

//   // 1️⃣ CRUD Operations for admin
//   static async createCoupon(data) {
//     return BXGYCouponRepository.create(data);
//   }

//   static async updateCoupon(id, data) {
//     return BXGYCouponRepository.update(id, data);
//   }

//   static async deleteCoupon(id) {
//     return BXGYCouponRepository.delete(id);
//   }

//   // 1️⃣ Sabhi coupons list karna (Details ke saath taaki frontend par products dikhen)
// static async listCoupons() {
//     try {
//       // Sabhi coupons fetch karein
//       const coupons = await BXGYcoupon.findAll();
      
//       // Har coupon ke liye free products ki details nikalein
//       const couponsWithDetails = await Promise.all(coupons.map(async (coupon) => {
//         // Model instance ko plain JSON mein badlein
//         const couponData = coupon.get({ plain: true });

//         // IDs check karein (Agar string hai toh parse karein, warna empty array)
//         let freeIds = [];
//         if (Array.isArray(couponData.freeProductIds)) {
//           freeIds = couponData.freeProductIds;
//         } else if (typeof couponData.freeProductIds === 'string') {
//           try {
//             freeIds = JSON.parse(couponData.freeProductIds);
//           } catch (e) { freeIds = []; }
//         }

//         // 3. FREE Products ki details fetch karein
//         const freeProducts = await Product.findAll({
//           where: { 
//             productId: freeIds // Aapki model file mein yahi Primary Key hai
//           },
//           attributes: ['productId', 'productName'], 
//           include: [
//             { 
//               model: ProductImage, 
//               as: 'images', // Product model mein defined association name
//               where: { isPrimary: true }, // Sirf main image
//               required: false // Agar image na ho toh bhi product dikhe
//             }
//           ]
//         });

//         // 4. Data format karein jo Frontend expect kar raha hai
//         couponData.freeProductsData = freeProducts.map(p => {
//           const productPlain = p.get({ plain: true });
//           return {
//             productId: productPlain.productId,
//             productName: productPlain.productName,
//             // Images array se pehli image ka fileUrl nikaalein
//             productImage: (productPlain.images && productPlain.images.length > 0) 
//               ? productPlain.images[0].fileUrl 
//               : null
//           };
//         });

//         return couponData;
//       }));

//       return couponsWithDetails;
//     } catch (error) {
//       console.error("Error in listCoupons Service:", error);
//       throw error;
//     }
//   }

//   // 2️⃣ Apply Coupon Logic Fix
//   static async applyCoupon(userId, couponCode, selectedFreeProductId) {
//     const coupon = await BXGYCouponRepository.findByCode(couponCode);
//     if (!coupon) throw new Error('Invalid or expired coupon');

//     const userCart = await cart.findOne({
//       where: { userId },
//       include: [{ model: cartitem, as: 'items' }]
//     });

//     if (!userCart || !userCart.items.length) throw new Error('Cart is empty');

//     // Mismatch fix: Ensure IDs are compared as Numbers
//     const buyItem = userCart.items.find(item => 
//       coupon.buyProductIds.map(Number).includes(Number(item.productId)) && 
//       Number(item.quantity) >= Number(coupon.buyQuantity)
//     );

//     if (!buyItem) throw new Error(`Add qualified products to your cart`);

//     // ERROR FIX HERE: Robust Validation
//     const freeProductList = Array.isArray(coupon.freeProductIds) 
//         ? coupon.freeProductIds.map(Number) 
//         : [];

//     if (!selectedFreeProductId || !freeProductList.includes(Number(selectedFreeProductId))) {
//         throw new Error('Please select a valid free product from the offer list');
//     }

//     // Free product ki details nikalna taaki cart item sahi bane
//     const freeProductDetail = await Product.findOne({ where: { productId: selectedFreeProductId } });

//     // Create free item logic
//     await cartitem.create({
//         cartId: userCart.id,
//         productId: selectedFreeProductId,
//         productName: `${freeProductDetail ? freeProductDetail.productName : 'Product'} (FREE)`,
//         basePrice: 0,
//         quantity: coupon.freeQuantity,
//         price: 0,
//         itemTotal: 0,
//         isFreeItem: true
//     });

//     await BXGYCouponRepository.incrementUsage(coupon.id);
//     return userCart;
//   }

//   // 3️⃣ Remove BXGY coupon from cart
//   static async removeCoupon(userId, couponCode) {
//     const coupon = await BXGYCouponRepository.findByCode(couponCode);
//     if (!coupon) throw new Error('Invalid coupon');

//     const userCart = await cart.findOne({ where: { userId } });
//     if (!userCart) throw new Error('Cart not found');

//     // Remove free product added by this coupon
//     await cartitem.destroy({
//       where: { cartId: userCart.id, productId: coupon.freeProductId, isFreeItem: true }
//     });

//     // Return updated cart
//     return await cart.findOne({
//       where: { id: userCart.id },
//       include: [{ model: cartitem, as: 'items', 
//         include: [
//         { model: Product, as: 'product' }
//       ] }]
//     });
//   }

// }

// module.exports = BXGYCouponService;


'use strict';

const BXGYCouponRepository = require('../repositories/bxgycoupon.repository');
// models/index.js se live instances import karein
const { cart, cartitem, Product, ProductImage, BXGYcoupon } = require('../database/models');

class BXGYCouponService {

  // 1️⃣ CRUD Operations for admin
  static async createCoupon(data) {
    return BXGYCouponRepository.create(data);
  }

  static async updateCoupon(id, data) {
    return BXGYCouponRepository.update(id, data);
  }

  static async deleteCoupon(id) {
    return BXGYCouponRepository.delete(id);
  }

  // 2️⃣ List Coupons Fix
  static async listCoupons() {
    try {
      // Sahi model instance use karein (jo upar import kiya hai)
      const coupons = await BXGYcoupon.findAll();
      
      const couponsWithDetails = await Promise.all(coupons.map(async (coupon) => {
        const couponData = coupon.get({ plain: true });

        // Parse IDs safely
        let freeIds = [];
        try {
          freeIds = Array.isArray(couponData.freeProductIds) 
            ? couponData.freeProductIds 
            : JSON.parse(couponData.freeProductIds || "[]");
        } catch (e) {
          freeIds = [];
        }

        // Fetch free products with images
        const freeProducts = await Product.findAll({
          where: { 
            productId: freeIds.map(Number) 
          },
          attributes: ['productId', 'productName'], 
          include: [
            { 
              model: ProductImage, 
              as: 'images',
              where: { isPrimary: true },
              required: false 
            }
          ]
        });

        // Format for Frontend
        couponData.freeProductsData = freeProducts.map(p => {
          const productPlain = p.get({ plain: true });
          return {
            productId: productPlain.productId,
            productName: productPlain.productName,
            productImage: (productPlain.images && productPlain.images.length > 0) 
              ? productPlain.images[0].fileUrl 
              : null
          };
        });

        return couponData;
      }));

      return couponsWithDetails;
    } catch (error) {
      console.error("Error in listCoupons Service:", error);
      throw error;
    }
  }

  // 3️⃣ Apply Coupon Logic
  static async applyCoupon(userId, couponCode, selectedFreeProductId) {
    const coupon = await BXGYCouponRepository.findByCode(couponCode);
    if (!coupon) throw new Error('Invalid or expired coupon');

    const userCart = await cart.findOne({
      where: { userId },
      include: [{ model: cartitem, as: 'items' }]
    });

    if (!userCart || !userCart.items.length) throw new Error('Cart is empty');

    // 🔴 BUG FIX 1: Check if a discount coupon is already applied
    if (userCart.couponId) {
        throw new Error("Cannot add a free gift while a discount coupon is applied. Remove the coupon first.");
    }

    // 🔴 BUG FIX 2: Prevent duplicate free items
    const existingFreeItem = userCart.items.find(item => item.isFreeItem === true);
    if (existingFreeItem) {
        throw new Error('You have already claimed a free gift. Remove it to select a different one.');
    }
    
    const buyItem = userCart.items.find(item => 
      coupon.buyProductIds.map(Number).includes(Number(item.productId)) && 
      Number(item.quantity) >= Number(coupon.buyQuantity)
    );

    if (!buyItem) throw new Error(`Add qualified products to your cart`);

    const freeProductList = Array.isArray(coupon.freeProductIds) 
        ? coupon.freeProductIds.map(Number) 
        : [];

    if (!selectedFreeProductId || !freeProductList.includes(Number(selectedFreeProductId))) {
        throw new Error('Please select a valid free product from the offer list');
    }

    const freeProductDetail = await Product.findOne({ 
    where: { productId: selectedFreeProductId },
    include: [{ 
      model: ProductImage, 
      as: 'images', 
      where: { isPrimary: true }, 
      required: false 
    }]
  });
  console.log("FREE PRODUCT DEBUG:", freeProductDetail?.images);

    await cartitem.create({
        cartId: userCart.id,
        productId: selectedFreeProductId,
        productName: `${freeProductDetail ? freeProductDetail.productName : 'Product'} (FREE)`,
        basePrice: 0,
        quantity: coupon.freeQuantity,
        price: 0,
        itemTotal: 0,
        isFreeItem: true,
        productImage: (freeProductDetail?.images && freeProductDetail.images.length > 0) 
                     ? freeProductDetail.images[0].fileUrl 
                     : null
    });

    await BXGYCouponRepository.incrementUsage(coupon.id);
    return userCart;
  }

  // 4️⃣ Remove Coupon
  static async removeCoupon(userId, couponCode) {
    const coupon = await BXGYCouponRepository.findByCode(couponCode);
    if (!coupon) throw new Error('Invalid coupon');

    const userCart = await cart.findOne({ where: { userId } });
    if (!userCart) throw new Error('Cart not found');

    await cartitem.destroy({
      where: { cartId: userCart.id, isFreeItem: true }
    });

    return await cart.findOne({
      where: { id: userCart.id },
      include: [{ model: cartitem, as: 'items' }]
    });
  }
}

module.exports = BXGYCouponService;