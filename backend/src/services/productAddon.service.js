'use strict';
const productAddonRepo = require('../repositories/productAddon.repository');

class ProductAddonService {
  async create(data) {
    return await productAddonRepo.createWithDetails(data);
  }

  async getAll() {
    return await productAddonRepo.getAll();
  }

  async getById(id) {
    return await productAddonRepo.getById(id);
  }

  async update(id, data) {
    return await productAddonRepo.updateWithDetails(id, data);
  }

  async delete(id) {
    return await productAddonRepo.delete(id);
  }
}

module.exports = new ProductAddonService();