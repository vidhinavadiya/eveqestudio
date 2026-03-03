// services/category.service.js

const CategoryRepository = require('../repositories/category.repository');

class CategoryService {

  static async getAllCategories() {
    return await CategoryRepository.findAll();
  }

  static async getCategoryById(id) {
    if (!id) throw new Error('Category ID is required');

    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error('Category not found');

    return category;
  }

  static async createCategory(data) {
    if (!data.categoryName || data.categoryName.trim() === '') {
      throw new Error('Category name is required');
    }

    const existing = await CategoryRepository.findByName(data.categoryName);
    if (existing) {
      throw new Error('Category already exists');
    }

    return await CategoryRepository.create(data);
  }

static async updateCategory(id, data) {
  if (!id) throw new Error('Category ID is required');

  if (data.categoryName) {
    const existing = await CategoryRepository.findByName(data.categoryName);
    if (existing && existing.id !== Number(id)) {
      throw new Error('Category name already in use');
    }
  }

  return await CategoryRepository.update(id, data);
}


  static async deleteCategory(id) {
    if (!id) throw new Error('Category ID is required');

    return await CategoryRepository.delete(id);
  }
}

module.exports = CategoryService;
