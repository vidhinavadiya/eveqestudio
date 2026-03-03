const { BXGYcoupon } = require('../database/models');
const { Op } = require('sequelize');

class BXGYCouponRepository {

  // Find coupon by code
  static async findByCode(code) {
    return BXGYcoupon.findOne({
      where: {
        code,
        active: true,
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() }
      }
    });
  }

  // Find by ID
  static async findById(id) {
    return BXGYcoupon.findByPk(id);
  }

  // Create coupon
  static async create(data) {
    return BXGYcoupon.create(data);
  }

  // Update coupon
  static async update(id, data) {
    const coupon = await BXGYcoupon.findByPk(id);
    if (!coupon) throw new Error('Coupon not found');
    return coupon.update(data);
  }

  // Delete coupon
  static async delete(id) {
    const coupon = await BXGYcoupon.findByPk(id);
    if (!coupon) throw new Error('Coupon not found');
    return coupon.destroy();
  }

  // Increment usage
  static async incrementUsage(couponId) {
    const coupon = await BXGYcoupon.findByPk(couponId);
    if (!coupon) throw new Error('Coupon not found');
    coupon.maxTotalUsage = coupon.maxTotalUsage ? coupon.maxTotalUsage + 1 : 1;
    await coupon.save();
    return coupon;
  }

  // List all coupons (optional)
  static async listAll() {
    return BXGYcoupon.findAll();
  }
}

module.exports = BXGYCouponRepository;
