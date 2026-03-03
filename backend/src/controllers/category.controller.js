const CategoryService = require('../services/category.service');

class CategoryController {
  // GET /categories
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /categories/:id
  static async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      res.status(200).json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /categories
static async createCategory(req, res) {
  try {
    const data = { ...req.body };

    // ✅ IMAGE HANDLE HERE (RIGHT PLACE)
    if (req.file) {
      data.categoryImage = req.file.filename;
    }

    const category = await CategoryService.createCategory(data);

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// PUT /categories/:id
static async updateCategory(req, res) {
  try {
    const data = { ...req.body };

    if (req.file) {
      // Field name DB ke hisab se
      data.categoryImage = req.file.filename;
    }

    const category = await CategoryService.updateCategory(req.params.id, data);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}



  // DELETE /categories/:id
  static async deleteCategory(req, res) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }


}

module.exports = CategoryController;
