const { coupon, couponusage, cart, cartitem, product } = require('../database/models');

class CouponRepository {

  static async findByCode(code) {
    return await coupon.findOne({
      where: {
        code: code.trim(),
        isActive: true
      }
    });
  }

  static async findById(id) {
    return await coupon.findByPk(id);
  }

  static async findAll() {
    return await coupon.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  static async create(data) {
    return await coupon.create(data);
  }

  static async update(id, data) {
    const couponData = await coupon.findByPk(id);
    if (!couponData) throw new Error("Coupon not found");

    await couponData.update(data);
    return couponData;
  }

  static async delete(id) {
    const couponData = await coupon.findByPk(id);
    if (!couponData) throw new Error("Coupon not found");

    await couponData.destroy();
    return true;
  }

  static async checkUserUsage(couponId, userId) {
  return await couponusage.findOne({
    where: { couponId, userId }
  });
}


  static async incrementUsage(couponData) {
    couponData.usedCount += 1;

    if (
      couponData.usageLimit &&
      couponData.usedCount >= couponData.usageLimit
    ) {
      couponData.isActive = false;
    }

    await couponData.save();
  }

static async getCartByUserId(userId) {
  return await cart.findOne({
    where: { userId },
    include: [
      {
        association: 'items',
        include: [
          {
            association: 'product'
          }
        ]
      }
    ]
  });
}



// static async saveCart(cartData) {
//   return await cartData.save();
// }

//   static async createUsage(data) {
//     return await couponusage.create(data);
//   }

//   static async getCouponByCode(code) {
//   return await coupon.findOne({
//     where: { code }
//   });
// }


}

module.exports = CouponRepository;
