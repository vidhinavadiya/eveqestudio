const cartRepository = require('../repositories/cart.repository');
const { cart, cartitem, cartitemcustomizations, BXGYcoupon } = require('../database/models');

class CartService {

  static async addToCart({ userId, data }) {

    if (!userId) throw new Error("User not authenticated");

    let activeCart = await cartRepository.findActiveCart(userId);

    if (!activeCart) {
      activeCart = await cartRepository.createCart(userId);
    }

    const product = await cartRepository.findProduct(data.productId);
    if (!product) throw new Error('Product not found');

    const primaryImageUrl = product.images?.[0]?.fileUrl || null;

    if (data.quantity > product.stockQuantity) {
      throw new Error('Quantity exceeds stock');
    }

    const basePrice = parseFloat(product.sellingPrice) || 0;
    const customizationPrice = parseFloat(data.customizationPrice) || 0;
    const quantity = parseInt(data.quantity, 10) || 1;

    if (isNaN(basePrice) || isNaN(customizationPrice) || isNaN(quantity)) {
      throw new Error('Invalid price or quantity value');
    }

    const itemTotal = (basePrice + customizationPrice) * quantity;

    const newItem = await cartitem.create({
      cartId: activeCart.id,
      productId: product.productId,
      productName: product.productName,
      basePrice,
      quantity,
      selectedColor: data.selectedColor || null,
      selectedSize: data.selectedSize || null,
      selectedLetters: data.selectedLetters || null,
      customizationPrice,
      itemTotal,
      productImage: primaryImageUrl,
    });

    if (data.customizations?.length > 0) {
      for (const c of data.customizations) {
        await cartitemcustomizations.create({
          cartItemId: newItem.id,
          groupName: c.groupName,
          fieldLabel: c.fieldLabel,
          userValue: c.userValue
        });
      }
    }

    await this.recalculateCart(activeCart.id);

    return { message: 'Product added to cart', cartId: activeCart.id };
  }

  static async updateQuantity({ cartItemId, quantity }) {

    const item = await cartitem.findOne({
      where: { id: cartItemId },
      include: [{ model: cart, as: 'cart', where: { status: 'active' } }]
    });

    if (!item) throw new Error('Cart item not found');
    if (quantity <= 0) throw new Error('Quantity must be greater than 0');

    const basePrice = parseFloat(item.basePrice) || 0;
    const custPrice = parseFloat(item.customizationPrice) || 0;
    const newQty = parseInt(quantity, 10);

    item.quantity = newQty;
    item.itemTotal = (basePrice + custPrice) * newQty;

    await item.save();

    await this.recalculateCart(item.cartId);

    return { message: 'Quantity updated successfully' };
  }

  static async recalculateCart(cartId) {

    const activeCart = await cartRepository.findActiveCartById(cartId);
    if (!activeCart) throw new Error("Cart not found");

    let subtotal = 0;

    activeCart.items?.forEach(item => {
      subtotal += parseFloat(item.itemTotal) || 0;
    });

    activeCart.subtotal = subtotal;
    activeCart.shippingCharge = subtotal >= 199 ? 0 : 40;

    // Remove invalid free items
const freeItems = activeCart.items.filter(i => i.isFreeItem);

for (const freeItem of freeItems) {

    const bxgyCoupon = await BXGYcoupon.findOne({
        where: { id: activeCart.bxgyCouponId }
    });

    const qualified = activeCart.items.find(item =>
        !item.isFreeItem &&
        bxgyCoupon.buyProductIds.includes(item.productId) &&
        item.quantity >= bxgyCoupon.buyQuantity
    );

    if (!qualified) {
        await freeItem.destroy();
    }
}
    if (activeCart.couponId) {

      const CouponRepository = require('../repositories/coupon.repository');
      const appliedCoupon = await CouponRepository.findById(activeCart.couponId);

      if (!appliedCoupon || !appliedCoupon.isActive) {
        activeCart.couponId = null;
        activeCart.couponDiscountAmount = 0;
      }

      else {

        if (subtotal < appliedCoupon.minorderamount) {
          activeCart.couponId = null;
          activeCart.couponDiscountAmount = 0;
        }

        else {

          let discount = 0;

          if (appliedCoupon.discountType === 'percentage') {
            discount = (subtotal * appliedCoupon.discountValue) / 100;

            if (
              appliedCoupon.maxDiscountAmount &&
              discount > appliedCoupon.maxDiscountAmount
            ) {
              discount = appliedCoupon.maxDiscountAmount;
            }
          }

          if (appliedCoupon.discountType === 'flat') {
            discount = appliedCoupon.discountValue;
          }

          activeCart.couponDiscountAmount = discount;
        }
      }
    }

    const finalAmount =
      subtotal - (parseFloat(activeCart.couponDiscountAmount) || 0)
      + activeCart.shippingCharge;

    activeCart.totalAmount = Math.max(0, finalAmount);

    await activeCart.save();
  }

  static async removeItem(cartItemId) {

    const item = await cartitem.findByPk(cartItemId);
    if (!item) throw new Error('Cart item not found');

    const cartId = item.cartId;

    await item.destroy();
    await this.recalculateCart(cartId);

    return { message: 'Item removed successfully' };
  }

 static async getCart(userId) {
  const activeCart = await cartRepository.findActiveCart(userId);

  if (!activeCart) {
    return {
      id: null,
      userId,
      items: [],
      subtotal: 0,
      shippingCharge: 0,
      couponDiscountAmount: 0,
      totalAmount: 0,
      status: 'active'
    };
  }

  // Map cart items to include free product info
  const items = activeCart.items.map(item => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    basePrice: item.basePrice,
    quantity: item.quantity,
    itemTotal: item.itemTotal,
    productImage: item.productImage,
    selectedColor: item.selectedColor,
    selectedSize: item.selectedSize,
    selectedLetters: item.selectedLetters,
    customizations: item.customizations || []
  }));

  return {
    id: activeCart.id,
    userId: activeCart.userId,
    items,
    subtotal: activeCart.subtotal,
    shippingCharge: activeCart.shippingCharge,
    couponDiscountAmount: activeCart.couponDiscountAmount,
    totalAmount: activeCart.totalAmount,
    status: activeCart.status
  };
}

}

module.exports = CartService;
