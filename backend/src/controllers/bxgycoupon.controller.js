const BXGYCouponService = require('../services/bxgycoupon.service');

class BXGYCouponController {
  //create
  static async create(req, res) {
      try {
          const data = req.body;
          const cleanedData = {...data,
              buyProductIds: Array.isArray(data.buyProductIds) ? data.buyProductIds.map(Number) : [Number(data.buyProductIds)],
              freeProductIds: Array.isArray(data.freeProductIds) ? data.freeProductIds.map(Number) : [Number(data.freeProductIds)],
              buyQuantity: parseInt(data.buyQuantity) || 1,
              freeQuantity: parseInt(data.freeQuantity) || 1,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate)
          };
          const coupon = await BXGYCouponService.createCoupon(cleanedData);
          res.json({ 
            success: true, 
            coupon 
          });
      } catch (err) {
          res.status(400).json({ 
            success: false, 
            message: err.message 
          });
      }
  }
  //update
  static async update(req, res) {
    try {
      const coupon = await BXGYCouponService.updateCoupon(req.params.id, req.body);
      res.json({ 
        success: true, 
        coupon 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //delete
  static async delete(req, res) {
    try {
      await BXGYCouponService.deleteCoupon(req.params.id);
      res.json({ 
        success: true, 
        message: 'Coupon deleted successfully' 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //get all coupon
  static async list(req, res) {
    try {
      const coupons = await BXGYCouponService.listCoupons();
      res.json({ 
        success: true, 
        coupons 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  // Apply / Remove
  static async apply(req, res) {
      try {
        const { userId, couponCode, selectedFreeProductId } = req.body;
        const cart = await BXGYCouponService.applyCoupon(userId, couponCode, selectedFreeProductId);
        res.json({ 
          success: true, 
          cart 
        });
      } catch (err) {
        res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }
  }
  //remove
  static async remove(req, res) {
    try {
      const { userId, couponCode } = req.body;
      const cart = await BXGYCouponService.removeCoupon(userId, couponCode);
      res.json({ 
        success: true, 
        cart 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
}

module.exports = BXGYCouponController;
