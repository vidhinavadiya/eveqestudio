const ProductService = require('../services/product.service');
const ProductRepository = require('../repositories/product.repository');

class ProductController {
  //create product
  static async createProduct(req, res) {
    try {
      const payload = req.body;
      const files = req.files;
      const product = await ProductService.createProduct(payload, files);
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  // UPDATE
  static async update(req, res) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body, req.files);
      return res.status(200).json({ 
        success: true, 
        message: 'Product updated', 
        data: product 
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ 
        success: false, 
        message: error.message
      });
    }
  }
  //update product
  static async quickUpdateProduct(req, res) {
    try {
      const product = await ProductService.quickUpdateProduct(req.params.id, req.body);
      return res.status(200).json({ 
        message: 'Product updated', 
        data: product 
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ 
        success: false, 
        message: error.message
      });
    }
  }
  // DELETE
  static async delete(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return res.status(200).json({ 
        success: true, 
        message: 'Product deleted' 
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ 
        success: false, 
        message: error.message
      });
    }
  }
  // GET ALL (Admin)
  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      return res.status(200).json({ 
        success: true, 
        data: products 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false, 
        message: error.message
      });
    }
  }
  // GET ONE (Admin)
  static async getById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return res.status(200).json({ 
        success: true, 
        data: product 
      });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ 
        success: false, 
        message: error.message
      });
    }
  }
  // GET ALL ACTIVE (Customer)
  static async getCustomerProducts(req, res) {
    try {
      const products = await ProductService.getCustomerProducts();
      return res.status(200).json({ 
        success: true, 
        data: products 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false, 
       message: error.message
      });
    }
  }
  // GET ONE ACTIVE (Customer)
  static async getCustomerProductById(req, res) {
    try {
      const product = await ProductService.getCustomerProductById(req.params.id);
      return res.status(200).json({ 
        success: true, 
        data: product 
      });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ 
        success: false, 
        message: error.message
      });
    }
  }
  //related product
  static async getRelatedProducts(req, res) {
    try {
      const { id } = req.params;
      const products = await ProductRepository.getRelatedProducts(id);
      return res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProductController;
