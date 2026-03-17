'use strict';
const productAddonService = require('../services/productAddon.service');

class ProductAddonController {
  async create(req, res) {
    try {
        if (req.file) {
            req.body.image = req.file.filename;
        }
      const result = await productAddonService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await productAddonService.getAll();
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const result = await productAddonService.getById(req.params.id);
      if (!result) return res.status(404).json({ success: false, message: 'Addon not found' });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
        if (req.file) {
            req.body.image = req.file.filename;
        }
      const result = await productAddonService.update(req.params.id, req.body);
      if (!result) return res.status(404).json({ success: false, message: 'Addon not found' });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await productAddonService.delete(req.params.id);
      if (!result) return res.status(404).json({ success: false, message: 'Addon not found' });
      res.json({ success: true, message: 'Addon deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ProductAddonController();