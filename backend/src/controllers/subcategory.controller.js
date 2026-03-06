const SubcategoryService = require('../services/subcategory.service');

class SubcategoryController {
  //only active subcategories
  static async getPublicSubcategories(req, res) {
    try {
      const subcategories = await SubcategoryService.getActiveSubcategories();
      res.status(200).json({ 
        success: true, 
        data: subcategories 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //ADMIN — all subcategories
  static async getAllSubcategories(req, res) {
    try {
      const subcategories = await SubcategoryService.getAllSubcategories();
      res.status(200).json({ 
        success: true, 
        data: subcategories 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //get by id subcategory
  static async getSubcategoryById(req, res) {
    try {
      const subcategory = await SubcategoryService.getSubcategoryById(req.params.id);
      if (!subcategory) return res.status(404).json({ 
        success: false, 
        message: 'Subcategory not found' 
      });
      res.status(200).json({ 
        success: true, 
        data: subcategory 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //create subcategory
  static async createSubcategory(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.subCategoryImage = req.file.filename;
      }
      const subcategory = await SubcategoryService.createSubcategory(data);
      res.status(201).json({ 
        success: true, 
        data: subcategory 
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //update subcategory
  static async updateSubcategory(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) data.subCategoryImage = req.file.filename;
      const subcategory = await SubcategoryService.updateSubcategory(req.params.id, data);
      if (!subcategory) return res.status(404).json({ 
        success: false, 
        message: 'Subcategory not found' 
      });
      res.status(200).json({ 
        success: true, 
        data: subcategory 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  //delete subcategory
  static async deleteSubcategory(req, res) {
    try {
      const result = await SubcategoryService.deleteSubcategory(req.params.id);
      if (!result) return res.status(404).json({ 
        success: false, 
        message: 'Subcategory not found' 
      });
      res.status(200).json({ 
        success: true, 
        message: 'Subcategory deleted successfully' 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
}

module.exports = SubcategoryController;
