'use strict';
const { ProductAddon, AddonSupportLink, AddonPoint } = require('../database/models');

class ProductAddonRepository {

  async createWithDetails(data) {
    const { supportLinks, points, ...addonData } = data;

    // ✅ Convert JSON string to array if necessary
    const supportLinksArray = typeof supportLinks === 'string'
      ? JSON.parse(supportLinks)
      : Array.isArray(supportLinks) ? supportLinks : [];

    const pointsArray = typeof points === 'string'
      ? JSON.parse(points)
      : Array.isArray(points) ? points : [];

    const addon = await ProductAddon.create(addonData);

    if (supportLinksArray.length > 0) {
      const links = supportLinksArray.map(l => ({ ...l, addonId: addon.id }));
      await AddonSupportLink.bulkCreate(links);
    }

    if (pointsArray.length > 0) {
      const pts = pointsArray.map(p => ({ ...p, addonId: addon.id }));
      await AddonPoint.bulkCreate(pts);
    }

    return this.getById(addon.id);
  }

  async updateWithDetails(id, data) {
    const addon = await ProductAddon.findByPk(id);
    if (!addon) return null;

    const { supportLinks, points, ...addonData } = data;

    const supportLinksArray = typeof supportLinks === 'string'
      ? JSON.parse(supportLinks)
      : Array.isArray(supportLinks) ? supportLinks : [];

    const pointsArray = typeof points === 'string'
      ? JSON.parse(points)
      : Array.isArray(points) ? points : [];

    await addon.update(addonData);

    // Delete old & create new
    await AddonSupportLink.destroy({ where: { addonId: id } });
    if (supportLinksArray.length > 0) {
      const links = supportLinksArray.map(l => ({ ...l, addonId: id }));
      await AddonSupportLink.bulkCreate(links);
    }

    await AddonPoint.destroy({ where: { addonId: id } });
    if (pointsArray.length > 0) {
      const pts = pointsArray.map(p => ({ ...p, addonId: id }));
      await AddonPoint.bulkCreate(pts);
    }

    return this.getById(id);
  }

  async getAll() {
    return await ProductAddon.findAll({
      include: [
        { model: AddonSupportLink, as: 'supportLinks' },
        { model: AddonPoint, as: 'points' }
      ]
    });
  }

  async getById(id) {
    return await ProductAddon.findByPk(id, {
      include: [
        { model: AddonSupportLink, as: 'supportLinks' },
        { model: AddonPoint, as: 'points' }
      ]
    });
  }

  async delete(id) {
    const addon = await ProductAddon.findByPk(id);
    if (!addon) return null;

    await AddonSupportLink.destroy({ where: { addonId: id } });
    await AddonPoint.destroy({ where: { addonId: id } });
    await addon.destroy();

    return true;
  }
}

module.exports = new ProductAddonRepository();