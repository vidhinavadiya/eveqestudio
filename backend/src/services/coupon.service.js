const CouponRepository = require('../repositories/coupon.repository');
const { cart, cartitem } = require('../database/models');

class CouponService {

static async applyCoupon({ code, userId, cartId }) {

  const couponData = await CouponRepository.findByCode(code);
  if (!couponData) throw new Error('Invalid or inactive coupon');

  
  if (couponData.expiryDate && new Date() > couponData.expiryDate) {
    throw new Error("Coupon expired");
  }

  const cartData = await cart.findByPk(cartId);
  if (!cartData) throw new Error("Cart not found");

  if (cartData.subtotal <= 0) {
    throw new Error("Cart is empty");
  }
 
  if (couponData.minorderamount &&
      cartData.subtotal < couponData.minorderamount) {
    throw new Error(`Minimum order amount ₹${couponData.minorderamount}`);
  }

  let discount = 0;

  // =============================
  // 🔹 PERCENTAGE
  // =============================
  if (couponData.discountType === 'percentage') {

    discount = (cartData.subtotal * couponData.discountValue) / 100;

    if (couponData.maxDiscountAmount &&
        discount > couponData.maxDiscountAmount) {
      discount = couponData.maxDiscountAmount;
    }
  }

  // =============================
  // 🔹 FLAT
  // =============================
  else if (couponData.discountType === 'flat') {

    discount = couponData.discountValue;
  }

  discount = Math.min(discount, cartData.subtotal);

  cartData.couponId = couponData.id;
  cartData.couponDiscountAmount = discount;
  cartData.totalAmount =
    cartData.subtotal - discount + cartData.shippingCharge;

  await cartData.save();

  return {
    success: true,
    discount,
    totalAmount: cartData.totalAmount
  };
}


    // Usage tracking
    // await CouponRepository.createUsage({
    //   couponId: couponData.id,
    //   userId,
    //   orderId: null
    // });

    // await CouponRepository.incrementUsage(couponData);

    // return {
    //   message: "Coupon applied successfully",
    //   discount,
    //   finalAmount: cartData.totalAmount
    // };


  // =========================
  // 🔹 REMOVE COUPON
  // =========================
  static async removeCoupon(cartId) {

    const cartData = await cart.findByPk(cartId);
    if (!cartData) throw new Error('Cart not found');

    cartData.couponId = null;
    cartData.couponDiscountAmount = 0;
    cartData.totalAmount =
      cartData.subtotal + cartData.shippingCharge;

    await cartData.save();

    return {
      message: 'Coupon removed successfully',
      finalAmount: cartData.totalAmount
    };
  }

  static async createCoupon(data) {
    return await CouponRepository.create(data);
  }

  static async updateCoupon(id, data) {
    return await CouponRepository.update(id, data);
  }

  static async deleteCoupon(id) {
    return await CouponRepository.delete(id);
  }

  static async getAllCoupons() {
    return await CouponRepository.findAll();
  }
//   static async applyB1G1Coupon(userId, couponCode) {
//     // 1️⃣ Validate coupon
//     const coupon = await CouponRepository.getCouponByCode(couponCode);
//     if (!coupon) {
//   throw new Error("Coupon not found");
// }

// if (!coupon.discountType || coupon.discountType.toLowerCase() !== "bxgy") {
//   throw new Error("Coupon is not BXGY type");
// }


// if (!coupon.isActive) {
//   throw new Error("Coupon inactive");
// }

// if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
//   throw new Error("Coupon expired");
// }


//     // 2️⃣ Get user cart
//     const cart = await CouponRepository.getCartByUserId(userId);
//     if (!cart || cart.items.length === 0) {
//       throw new Error("Cart is empty");
//     }

//     // 3️⃣ Find eligible products
//     const freeProducts = [];
//     cart.items.forEach((item) => {
//       if (item.quantity >= 1) {
//         freeProducts.push({
//           product: item.product._id,
//           quantity: 1,
//           name: item.product.name,
//         });
//       }
//     });

//     // 4️⃣ Add free products to cart
//     freeProducts.forEach((fp) => {

//   const existing = cart.items.find(
//     (i) => i.productId === fp.product
//   );

//   if (existing) {
//     existing.quantity += fp.quantity;
//     existing.isFree = true;
//   } else {
//     cart.items.push({
//       cartId: cart.id,
//       productId: fp.product,
//       productName: fp.name,
//       basePrice: 0,
//       quantity: fp.quantity,
//       itemTotal: 0,
//       isFree: true
//     });
//   }
// });


//     await CouponRepository.saveCart(cart);

//     return freeProducts;
//   }
}

module.exports = CouponService;
