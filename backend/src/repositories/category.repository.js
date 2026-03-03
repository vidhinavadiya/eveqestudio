const { category } = require('../database/models');

class CategoryRepository {
  // repositories/category.repository.js

static async findByName(name) {
  return await category.findOne({
    where: { categoryName: name }
  });
}

  // Get all categories
static async findAll() {
  return await category.findAll({
    order: [['id', 'DESC']],
    include: [
      {
        association: 'subcategories',
        where: { status: true },
        required: false
      }
    ]
  });
}


  // Get category by ID
  static async findById(id) {
    return await category.findByPk(id);
  }

  // Create new category
  static async create(data) {
    return await category.create(data);
  }

  // Update category
  static async update(id, data) {
    const cat = await category.findByPk(id);
    if (!cat) throw new Error('Category not found');
    return await cat.update(data);
  }

  // Delete category
  static async delete(id) {
    const cat = await category.findByPk(id);
    if (!cat) throw new Error('Category not found');
    return await cat.destroy();
  }
}

module.exports = CategoryRepository;
