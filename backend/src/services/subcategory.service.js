const SubcategoryRepository = require('../repositories/subcategory.repository');

class SubcategoryService {
  static async getAllSubcategories() {
    return await SubcategoryRepository.findAll();
  }

  static async getActiveSubcategories() {
    return await SubcategoryRepository.findActive();
  }

  static async getSubcategoryById(id) {
    return await SubcategoryRepository.findById(id);
  }

  static async createSubcategory(data) {
    return await SubcategoryRepository.create(data);
  }

  static async updateSubcategory(id, data) {
    return await SubcategoryRepository.update(id, data);
  }

  static async deleteSubcategory(id) {
    return await SubcategoryRepository.delete(id);
  }
}

module.exports = SubcategoryService;
