'use strict';

const productAddonService = require('../services/productAddon.service');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

class ProductAddonController {

  // CREATE
  async create(req, res) {
    try {
      const data = { ...req.body };

      if (req.file) {
        const uploadedImage = await uploadToCloudinary(
          req.file.buffer,
          'eveqe/product-addons'
        );

        data.image = uploadedImage.secure_url;
      }

      const result = await productAddonService.create(data);

      res.status(201).json({
        success: true,
        data: result
      });

    } catch (err) {
      console.error('Product Addon Create Error:', err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  // GET ALL
  async getAll(req, res) {
    try {
      const result = await productAddonService.getAll();

      res.json({
        success: true,
        data: result
      });

    } catch (err) {
      console.error('Product Addon Get All Error:', err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  // GET BY ID
  async getById(req, res) {
    try {
      const result = await productAddonService.getById(req.params.id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Addon not found'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (err) {
      console.error('Product Addon Get By ID Error:', err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  // UPDATE
  async update(req, res) {
    try {
      const data = { ...req.body };

      if (req.file) {
        const uploadedImage = await uploadToCloudinary(
          req.file.buffer,
          'eveqe/product-addons'
        );

        data.image = uploadedImage.secure_url;
      }

      const result = await productAddonService.update(
        req.params.id,
        data
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Addon not found'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (err) {
      console.error('Product Addon Update Error:', err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      const result = await productAddonService.delete(req.params.id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Addon not found'
        });
      }

      res.json({
        success: true,
        message: 'Addon deleted successfully'
      });

    } catch (err) {
      console.error('Product Addon Delete Error:', err);

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new ProductAddonController();