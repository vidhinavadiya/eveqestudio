const { FAQ } = require("../database/models");

class FaqRepository {

  async create(data) {
    return await FAQ.create(data);
  }

  async findAll() {
    return await FAQ.findAll({
      order: [["createdAt", "DESC"]]
    });
  }

  async findActive() {
    return await FAQ.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]]
    });
  }

  async findById(id) {
    return await FAQ.findByPk(id);
  }

  async update(id, data) {
    return await FAQ.update(data, {
      where: { id }   // ✅ FIXED
    });
  }

  async delete(id) {
    return await FAQ.destroy({
      where: { id }   // ✅ FIXED
    });
  }
}

module.exports = new FaqRepository();