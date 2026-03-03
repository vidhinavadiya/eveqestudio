const couponService = require('../services/coupon.service');
const BXGYCouponService = require('../services/bxgycoupon.service'); // 👈 Nayi service import karein
const { cartitem, cart } = require('../database/models');

class CouponController {

static async applyCoupon(req, res) {
    try {
      const { code, cartId, selectedFreeProductId } = req.body;
      const userId = req.user.id;


      const cartData = await cart.findByPk(cartId);

if (cartData.couponId || await cartitem.findOne({
    where: { cartId, isFreeItem: true }
})) {
    throw new Error("Only one coupon can be applied per order");
}
      if (selectedFreeProductId) {
        // 1. Agar BXGY apply ho raha hai, toh purana discount hatao
        await couponService.removeCoupon(cartId); 
        
        const result = await BXGYCouponService.applyCoupon(userId, code, selectedFreeProductId);
        return res.status(200).json({ success: true, data: result });
        
      } 

      else {
        // 2. Agar Normal Discount apply ho raha hai, toh purane Free Items hatao
        // Pehle yahan 'cartitem' defined nahi tha, ab humne upar import kar liya hai
        await cartitem.destroy({ 
          where: { cartId: cartId, isFreeItem: true } 
        });
        
        const result = await couponService.applyCoupon({ code, userId, cartId });
        return res.status(200).json({ success: true, data: result });
      }

      

    } catch (err) {
      console.error("APPLY ERROR:", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
  static async removeCoupon(req, res) {
    try {
      const { cartId } = req.body;

      const result = await couponService.removeCoupon(cartId);

      res.status(200).json({
        success: true,
        data: result
      });

    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
  // 🔹 Admin Create
static async createCoupon(req, res) {
  try {
    const result = await couponService.createCoupon(req.body);

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// 🔹 Admin Update
static async updateCoupon(req, res) {
  try {
    const { id } = req.params;

    const result = await couponService.updateCoupon(id, req.body);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// 🔹 Admin Delete
static async deleteCoupon(req, res) {
  try {
    const { id } = req.params;

    await couponService.deleteCoupon(id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// 🔹 Admin Get All
 static async getAllCoupons(req, res) {
  try {
    const result = await couponService.getAllCoupons();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

}

module.exports = CouponController;
