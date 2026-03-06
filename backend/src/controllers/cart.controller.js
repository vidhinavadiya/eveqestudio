const cartService = require('../services/cart.service');
const { cartitem } = require('../database/models');

class CartController {
  //add to cart
  static async addToCart(req, res) {
    try {
      const userId = req.user?.id || 1;
      const result = await cartService.addToCart({
        userId,
        data: req.body
      });
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
  //update
  static async updateQuantity(req, res) {
    try {
      const { cartItemId } = req.body;
      const item = await cartitem.findByPk(cartItemId);
      if (item && item.isFreeItem) {
          return res.status(400).json({ 
              success: false, 
              message: "Free gift quantity cannot be changed." 
          });
      }
      const result = await cartService.updateQuantity(req.body);
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
  //remove
  static async removeItem(req, res) {
    try {
      const { cartItemId } = req.body;
      const result = await cartService.removeItem(cartItemId);
      res.json({ 
        success: true, 
        message: result.message 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //get cart
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await cartService.getCart(userId);
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

module.exports = CartController;
