const { Op, Sequelize } = require('sequelize');
const db = require('../database/models');

const { Product, ProductImage, ProductColor, ProductSize, ProductKeyPoint, LetterOption, CustomizationGroup, CustomizationField } = db;


class ProductRepository {
  static async createProduct(data, transaction) {
    return await Product.create(
      {
        productName: data.productName,
        productTitle: data.productTitle,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        sku: data.sku,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        discountPrice: data.discountPrice,
        status: data.status,
        shortDescription: data.shortDescription,
        productDescription: data.productDescription,
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
        manufacturerName: data.manufacturerName,
        countryOfOrigin: data.countryOfOrigin,
        netQuantity: data.netQuantity,
        printingTime: data.printingTime,
        stockQuantity: data.stockQuantity || 0,
        material: data.material || null
      },
      { transaction }
    );
  }

  async createProductImages(images, transaction) {
    return await ProductImage.bulkCreate(images, { transaction });
  }

  // GET ALL (Admin / List)
  static async getAllProducts() {
    return await Product.findAll({
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductColor, as: 'colors' },
        { model: ProductSize, as: 'sizes' },
        { model: ProductKeyPoint, as: 'keyPoints' },
        { model: LetterOption, as: 'letters' },
        {
          model: CustomizationGroup,
          as: 'customizationGroups',
          include: [{ model: CustomizationField, as: 'fields' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  // GET ONE (by ID)
  static async getProductById(id) {
    return await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductColor, as: 'colors' },
        { model: ProductSize, as: 'sizes' },
        { model: ProductKeyPoint, as: 'keyPoints' },
        { model: LetterOption, as: 'letters' },
        {
          model: CustomizationGroup,
          as: 'customizationGroups',
          include: [{ model: CustomizationField, as: 'fields' }]
        }
      ]
    });
  }

  // UPDATE - Full nested replace (old related data delete + new create)
// UPDATE - Keep existing media, only add new + remove specific
static async updateProduct(id, data, files, transaction) {
  const product = await Product.findByPk(id, { transaction });
  if (!product) throw new Error('Product not found');

  // Step 1: Update main product fields (same as before)
  await product.update({
    productName: data.productName || product.productName,
    productTitle: data.productTitle || product.productTitle,
    categoryId: data.categoryId || product.categoryId,
    subcategoryId: data.subcategoryId !== undefined ? data.subcategoryId : product.subcategoryId,
    sku: data.sku || product.sku,
    mrp: data.mrp !== undefined ? parseFloat(data.mrp) : product.mrp,
    sellingPrice: data.sellingPrice !== undefined ? parseFloat(data.sellingPrice) : product.sellingPrice,
    discountPrice: data.discountPrice !== undefined ? parseFloat(data.discountPrice) : product.discountPrice,
    status: data.status || product.status,
    shortDescription: data.shortDescription || product.shortDescription,
    productDescription: data.productDescription || product.productDescription,
    length: data.length !== undefined ? parseFloat(data.length) : product.length,
    width: data.width !== undefined ? parseFloat(data.width) : product.width,
    height: data.height !== undefined ? parseFloat(data.height) : product.height,
    weight: data.weight !== undefined ? parseFloat(data.weight) : product.weight,
    manufacturerName: data.manufacturerName || product.manufacturerName,
    countryOfOrigin: data.countryOfOrigin || product.countryOfOrigin,
    netQuantity: data.netQuantity || product.netQuantity,
    printingTime: data.printingTime || product.printingTime,
    stockQuantity: data.stockQuantity !== undefined ? parseInt(data.stockQuantity, 10) : product.stockQuantity,
    material: data.material !== undefined ? data.material : product.material
  }, { transaction });

  // Step 2: Update other nested data (colors, sizes, etc.) – yeh replace rahega (agar chahte ho to isko bhi preserve kar sakte hain baad mein)
  // Delete old related data EXCEPT images (images ko alag handle karenge)
  await Promise.all([
    db.ProductColor.destroy({ where: { productId: id }, transaction }),
    db.ProductSize.destroy({ where: { productId: id }, transaction }),
    db.ProductKeyPoint.destroy({ where: { productId: id }, transaction }),
    db.LetterOption.destroy({ where: { productId: id }, transaction }),
    db.CustomizationGroup.destroy({ where: { productId: id }, transaction }) // cascades to fields
  ]);

  // Step 3: Re-create other nested data (same as before)
  if (data.keyPoints && Array.isArray(data.keyPoints)) {
    await db.ProductKeyPoint.bulkCreate(
      data.keyPoints.map(kp => ({
        productId: id,
        pointText: kp.pointText,
        sortOrder: kp.sortOrder || 1
      })),
      { transaction }
    );
  }

  if (data.colors && Array.isArray(data.colors)) {
    await db.ProductColor.bulkCreate(
      data.colors.map(c => ({
        productId: id,
        colorName: c.colorName,
        colorCode: c.colorCode,
        isActive: c.isActive !== false
      })),
      { transaction }
    );
  }

  if (data.sizes && Array.isArray(data.sizes)) {
    await db.ProductSize.bulkCreate(
      data.sizes.map(s => ({
        productId: id,
        sizeName: s.sizeName,
        sizeValue: s.sizeValue,
        isActive: s.isActive !== false
      })),
      { transaction }
    );
  }

  if (data.letters && Array.isArray(data.letters)) {
    await db.LetterOption.bulkCreate(
      data.letters.map(l => ({
        productId: id,
        letter: l.letter,
        price: l.price ? parseFloat(l.price) : 0,
        isActive: l.isActive !== false
      })),
      { transaction }
    );
  }

  if (data.customizationGroups && Array.isArray(data.customizationGroups)) {
    for (const group of data.customizationGroups) {
      const newGroup = await db.CustomizationGroup.create(
        {
          productId: id,
          groupName: group.groupName,
          sortOrder: group.sortOrder || 1
        },
        { transaction }
      );

      if (group.fields && Array.isArray(group.fields)) {
        await db.CustomizationField.bulkCreate(
          group.fields.map(f => ({
            groupId: newGroup.id,
            label: f.label || '',
            fieldType: f.fieldType || 'text',
            isRequired: f.isRequired !== false,
            sortOrder: f.sortOrder || 1,
            allowedValues: f.allowedValues || '',
            minLength: f.minLength && !isNaN(Number(f.minLength)) ? Number(f.minLength) : null,
            maxLength: f.maxLength && !isNaN(Number(f.maxLength)) ? Number(f.maxLength) : null,
          })),
          { transaction }
        );
      }
    }
  }

  // Step 4: Handle media – IMPORTANT CHANGE HERE
  // Purane images delete nahi honge, sirf removed IDs wale delete honge + naye add honge
  if (files || data.removedMediaIds) {
    // Remove specific media if IDs sent
    if (data.removedMediaIds) {
      let removedIds = [];
      try {
        removedIds = JSON.parse(data.removedMediaIds);
      } catch (e) {
        console.error('Invalid removedMediaIds format:', e);
      }

      if (removedIds.length > 0) {
        await ProductImage.destroy({
          where: {
            id: removedIds,
            productId: id
          },
          transaction
        });
      }
    }

    // Add new images
    if (files?.productImages?.length) {
      const newImages = files.productImages.map((file, i) => ({
        productId: id,
        fileUrl: `/uploads/products/${file.filename}`,
        fileType: 'image',
        isPrimary: i === 0
      }));

      await ProductImage.bulkCreate(newImages, { transaction });
    }

    // Add new videos
    if (files?.productVideos?.length) {
      const newVideos = files.productVideos.map(file => ({
        productId: id,
        fileUrl: `/uploads/products/${file.filename}`,
        fileType: 'video',
        isPrimary: false
      }));

      await ProductImage.bulkCreate(newVideos, { transaction });
    }
  }

  // Step 5: Reload product with latest data
  return await Product.findByPk(id, {
    include: [
      { model: ProductImage, as: 'images' },
      { model: ProductColor, as: 'colors' },
      { model: ProductSize, as: 'sizes' },
      { model: ProductKeyPoint, as: 'keyPoints' },
      { model: LetterOption, as: 'letters' },
      {
        model: CustomizationGroup,
        as: 'customizationGroups',
        include: [{ model: CustomizationField, as: 'fields' }]
      }
    ],
    transaction
  });
}

  // DELETE
  static async deleteProduct(id, transaction) {
    const product = await Product.findByPk(id, { transaction });
    if (!product) throw new Error('Product not found');

    await product.destroy({ transaction });
    return { message: 'Product deleted successfully' };
  }


  static async findById(productId) {
    return await Product.findByPk(productId);
  }

  static async findRelatedProducts(categoryId, currentProductId) {
    return await Product.findAll({
      where: {
        categoryId: categoryId,
        productId: { [Op.ne]: currentProductId },
        status: 'active',
        stockQuantity: { [Op.gt]: 0 }
      },
      attributes: ['productId', 'productName', 'productTitle', 'sellingPrice', 'mrp', 'createdAt'],
      include: [
        { model: ProductImage, as: 'images', attributes: ['fileUrl'] },
        { model: ProductColor, as: 'colors', attributes: ['colorName', 'colorCode'] },
        { model: ProductSize, as: 'sizes', attributes: ['sizeName', 'sizeValue'] },
        { model: ProductKeyPoint, as: 'keyPoints', attributes: ['pointText'] },
        { model: LetterOption, as: 'letters', attributes: ['letter', 'price'] },
        {
          model: CustomizationGroup,
          as: 'customizationGroups',
          attributes: ['groupName'],
          include: [{ model: CustomizationField, as: 'fields', attributes: ['label', 'fieldType'] }]
        }
      ],
      limit: 6,
      order: [['createdAt', 'DESC']] // works because 'createdAt' included in attributes
    });
  }

  static async getRelatedProducts(productId) {
    const product = await this.findById(productId);

    if (!product) throw new Error("Product not found");

    const relatedProducts = await this.findRelatedProducts(product.categoryId, product.productId);
    return relatedProducts;
  }
}

module.exports = ProductRepository;