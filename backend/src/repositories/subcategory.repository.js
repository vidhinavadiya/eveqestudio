const { subcategory } = require('../database/models'); // PascalCase

class SubcategoryRepository {
  static async findAll() {
    return await subcategory.findAll({
      include: ['category'], // Include category info
      order: [['id', 'ASC']],
    });
  }

  static async findActive() {
    return await subcategory.findAll({
      where: { status: true },
      include: ['category'],
      order: [['id', 'ASC']],
    });
  }

  static async findById(id) {
    return await subcategory.findByPk(id, {
      include: ['category'],
    });
  }

  static async create(data) {
    return await subcategory.create(data);
  }

  static async update(id, data) {
    const subcat = await subcategory.findByPk(id);
    if (!subcat) return null;
    return await subcat.update(data);
  }

  static async delete(id) {
    const subcat = await subcategory.findByPk(id);
    if (!subcat) return null;
    await subcat.destroy();
    return true;
  }
}

module.exports = SubcategoryRepository;
