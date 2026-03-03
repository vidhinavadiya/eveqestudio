const db = require('../database/models');
const ProductRepository = require('../repositories/product.repository');
const sequelize = db.sequelize;

const { 
  Product, ProductImage, ProductColor, ProductSize,
  ProductKeyPoint, CustomizationGroup, CustomizationField,
  LetterOption 
} = db;
const { Op } = require('sequelize');

class ProductService {
  static async createProduct(payload, files) {
    const transaction = await sequelize.transaction();

    try {
      // Parse JSON string fields that come from FormData
      const parsed = { ...payload };

      const jsonFields = ['keyPoints', 'colors', 'sizes', 'letters', 'customizationGroups'];

      jsonFields.forEach(field => {
        if (typeof payload[field] === 'string') {
          try {
            parsed[field] = JSON.parse(payload[field]);
          } catch (e) {
            console.error(`Failed to parse ${field}:`, payload[field]);
            parsed[field] = [];
          }
        } else if (Array.isArray(payload[field])) {
          parsed[field] = payload[field];
        } else {
          parsed[field] = [];
        }
      });

      const imageFiles = files?.productImages || [];
      const videoFiles = files?.productVideos || [];

      const productData = {
        productName:        parsed.productName || '',
        productTitle:       parsed.productTitle || '',

        categoryId:     parsed.categoryId && String(parsed.categoryId).trim() !== ''
                          ? Number(parsed.categoryId)
                          : null,

        subcategoryId:  parsed.subcategoryId && String(parsed.subcategoryId).trim() !== ''
                          ? Number(parsed.subcategoryId)
                          : null,

        sku:                parsed.sku || '',
        mrp:                parseFloat(parsed.mrp || 0),
        sellingPrice:       parseFloat(parsed.sellingPrice || 0),
        discountPrice:      parsed.discountPrice ? parseFloat(parsed.discountPrice) : null,
        status:             parsed.status || 'active',
        shortDescription:   parsed.shortDescription || '',
        productDescription: parsed.productDescription || '',
        length:             parsed.length ? parseFloat(parsed.length) : null,
        width:              parsed.width ? parseFloat(parsed.width) : null,
        height:             parsed.height ? parseFloat(parsed.height) : null,
        weight:             parsed.weight ? parseFloat(parsed.weight) : null,
        manufacturerName:   parsed.manufacturerName || '',
        countryOfOrigin:    parsed.countryOfOrigin || '',
        netQuantity:        parsed.netQuantity || '',
        printingTime:       parsed.printingTime || '',

        // ← stockQuantity जोड़ा गया
        stockQuantity: parsed.stockQuantity !== undefined 
                        ? parseInt(parsed.stockQuantity, 10) 
                        : 0,
        material: parsed.material || null,

       images: [
          ...imageFiles.map((file, i) => ({
            fileUrl: `/uploads/products/${file.filename}`,
            fileType: 'image',
            isPrimary: i === 0
          })),
          ...videoFiles.map((file) => ({
            fileUrl: `/uploads/products/${file.filename}`,
            fileType: 'video',
            isPrimary: false
          }))
        ],

        keyPoints: (parsed.keyPoints || []).map(kp => ({
          pointText: kp.pointText || '',
          sortOrder: kp.sortOrder || 1
        })),

        colors: (parsed.colors || []).map(c => ({
          colorName:  c.colorName || '',
          colorCode:  c.colorCode || '',
          isActive:   c.isActive !== false
        })),

        sizes: (parsed.sizes || []).map(s => ({
          sizeName:  s.sizeName || '',
          sizeValue: s.sizeValue || '',
          isActive:  s.isActive !== false
        })),

        letters: (parsed.letters || []).map(l => ({
          letter:   l.letter || '',
          price:    l.price ? parseFloat(l.price) : 0,
          isActive: l.isActive !== false
        })),

        customizationGroups: (parsed.customizationGroups || []).map(group => ({
          groupName: group.groupName || '',
          sortOrder: group.sortOrder || 1,

          fields: (group.fields || []).map(field => ({
            label:       field.label || '',
            fieldType:   field.fieldType || 'text',
            isRequired:  field.isRequired !== false,
            sortOrder:   field.sortOrder || 1,
            minLength:   field.minLength || null,
            maxLength:   field.maxLength || null,
            allowedValues: field.allowedValues || ''
          }))
        }))
      };

      const product = await Product.create(productData, {
        include: [
          { model: ProductImage,           as: 'images' },
          { model: ProductKeyPoint,        as: 'keyPoints' },
          { model: ProductColor,           as: 'colors' },
          { model: ProductSize,            as: 'sizes' },
          { model: LetterOption,           as: 'letters' },
          {
            model: CustomizationGroup,
            as: 'customizationGroups',
            include: [{ model: CustomizationField, as: 'fields' }]
          }
        ],
        transaction
      });

      await transaction.commit();
      return product;

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  static async getAllProducts() {
    return await ProductRepository.getAllProducts();
  }

  static async getProductById(id) {
    const product = await ProductRepository.getProductById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

static async updateProduct(id, payload, files) {
  const transaction = await sequelize.transaction();

  try {
    // 1. Parse JSON fields
    const parsed = { ...payload };

    const jsonFields = ['keyPoints', 'colors', 'sizes', 'letters', 'customizationGroups'];

    jsonFields.forEach(field => {
      if (typeof payload[field] === 'string') {
        try {
          parsed[field] = JSON.parse(payload[field]);
        } catch (e) {
          console.error(`Failed to parse ${field} in update:`, payload[field]);
          parsed[field] = [];
        }
      } else if (Array.isArray(payload[field])) {
        parsed[field] = payload[field];
      } else {
        parsed[field] = [];
      }
    });

    // 2. Prepare safe top-level product data
    // (No minLength/maxLength here — they belong in nested fields)
    const safeData = {
      ...parsed,

      categoryId: parsed.categoryId && String(parsed.categoryId).trim() !== ''
        ? Number(parsed.categoryId)
        : null,

      subcategoryId: parsed.subcategoryId && String(parsed.subcategoryId).trim() !== ''
        ? Number(parsed.subcategoryId)
        : null,

      mrp: parsed.mrp !== undefined ? parseFloat(parsed.mrp) || 0 : undefined,
      sellingPrice: parsed.sellingPrice !== undefined ? parseFloat(parsed.sellingPrice) || 0 : undefined,
      discountPrice: parsed.discountPrice !== undefined ? parseFloat(parsed.discountPrice) || null : undefined,
      length: parsed.length !== undefined ? parseFloat(parsed.length) || null : undefined,
      width: parsed.width !== undefined ? parseFloat(parsed.width) || null : undefined,
      height: parsed.height !== undefined ? parseFloat(parsed.height) || null : undefined,
      weight: parsed.weight !== undefined ? parseFloat(parsed.weight) || null : undefined,

      stockQuantity: parsed.stockQuantity !== undefined
        ? Math.max(0, parseInt(parsed.stockQuantity, 10) || 0)
        : undefined,

      material: parsed.material !== undefined ? String(parsed.material).trim() || null : undefined
    };

    // 3. Call repository with safe top-level data
    const updated = await ProductRepository.updateProduct(id, safeData, files, transaction);

    await transaction.commit();
    return updated;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

  static async deleteProduct(id) {
    const transaction = await sequelize.transaction();
    try {
      const result = await ProductRepository.deleteProduct(id, transaction);
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

 static async getCustomerProducts() {
    return await db.Product.findAll({
      where: { status: 'active', stockQuantity: { [Op.gt]: 0 } }, // ← स्टॉक > 0 वाले ही दिखें
      include: [
        { model: db.ProductImage, as: 'images' },
        { model: db.ProductColor, as: 'colors' },
        { model: db.ProductSize, as: 'sizes' },
        { model: db.ProductKeyPoint, as: 'keyPoints' },
        { model: db.LetterOption, as: 'letters' },
        {
          model: db.CustomizationGroup,
          as: 'customizationGroups',
          include: [{ model: db.CustomizationField, as: 'fields' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

 static async getCustomerProductById(id) {
    const product = await Product.findByPk(id, {
      where: { status: 'active', stockQuantity: { [Op.gt]: 0 } },
      include: [
        { model: db.ProductImage, as: 'images' },
        { model: db.ProductColor, as: 'colors' },
        { model: db.ProductSize, as: 'sizes' },
        { model: db.ProductKeyPoint, as: 'keyPoints' },
        { model: db.LetterOption, as: 'letters' },
        {
          model: db.CustomizationGroup,
          as: 'customizationGroups',
          include: [{ model: db.CustomizationField, as: 'fields' }]
        }
      ]
    });
    if (!product) throw new Error('Product not found or inactive/out of stock');
    return product;
  }

  static async  quickUpdateProduct(id, updates) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.update(updates);
    return product;
}
}

module.exports = ProductService;