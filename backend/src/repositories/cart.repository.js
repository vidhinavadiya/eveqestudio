const { cart, cartitem, cartitemcustomizations, Product, ProductImage } = require('../database/models');

class CartRepository {

  static async findActiveCart(userId) {
    return await cart.findOne({
      where: { userId, status: 'active' },
      include: [
        {
          model: cartitem,
          as: 'items',
          include: [
            { model: Product, as: 'product' },
            { model: cartitemcustomizations, as: 'customizations' }
          ]
        }
      ]
    });
  }

  static async findActiveCartById(cartId) {
    return await cart.findOne({
      where: { id: cartId, status: 'active' },
      include: [
        {
          model: cartitem,
          as: 'items',
          include: [
            { model: cartitemcustomizations, as: 'customizations' }
          ]
        }
      ]
    });
  }

  static async createCart(userId) {
    return await cart.create({
      userId,
      status: 'active',
      subtotal: 0,
      shippingCharge: 0,
      couponDiscountAmount: 0,
      totalAmount: 0
    });
  }

 static async findProduct(productId) {
  return await Product.findByPk(productId, {
    attributes: [
      'productId',
      'productName',
      'sellingPrice',
      'stockQuantity'
    ],
    include: [
      {
        model: ProductImage,   // db se import hai to sahi
        as: 'images',              // ← Product model ke hasMany se match karo = 'images'
        attributes: ['fileUrl', 'isPrimary'],
        required: false,
        where: { isPrimary: true },
        limit: 1
      }
    ]
  });
}

// cart.repository.js

static async clearCart(userId, transaction) {
    return await cart.update(
        { status: 'ordered' }, // Aapke model mein 'ordered' defined hai
        { 
            where: { 
                userId, 
                status: 'active' 
            }, 
            transaction 
        }
    );
}

}

module.exports = CartRepository;
