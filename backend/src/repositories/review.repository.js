// const { Review, user, Product, ProductImage } = require('../database/models');

// class ReviewRepository {

//     async create(data) {
//         return await Review.create(data);
//     }

// async findByProductId(productId) {
//     return await Review.findAll({
//         where: { productId },
//         include: [
//             {
//                 model: user,
//                 as: 'user',
//                 attributes: ['id', 'username', 'email'] 
//             }
//         ],
//         order: [['createdAt', 'DESC']]
//     });
// }

//     async findById(id) {
//         return await Review.findByPk(id);
//     }

//     async delete(id) {
//         return await Review.destroy({
//             where: { id }
//         });
//     }

// async update(id, data) {
//     // 1. Update logic
//     const [rowsUpdated] = await Review.update(data, { 
//         where: { id: id } 
//     });

//     // 2. Agar row update hui hai (rowsUpdated > 0), to fetch karke return karein
//     if (rowsUpdated > 0) {
//         return await this.findById(id);
//     }
    
//     // Agar koi badlav nahi hua ya ID galat thi
//     return null; 
// }
// async findAll() {
//     return await Review.findAll({
//         include: [
//             {
//                 model: user,
//                 as: 'user',
//                 attributes: ['id', 'username', 'email']
//             }
//         ],
//         order: [['createdAt', 'DESC']]
//     });
// }
// async findAllPublic() {
//     return await Review.findAll({
//         include: [
//             {
//                 model: user,
//                 as: 'user',
//                 attributes: ['id', 'username']
//             },
//             {
//                 model: Product,
//                 as: 'product',
//                 attributes: ['productId', 'productName'],
//                 include: [
//                     {
//                         model: ProductImage,
//                         as: 'images',
//                         attributes: ['fileUrl']
//                     }
//                 ]
//             }
//         ],
//         order: [['createdAt', 'DESC']]
//     });
// }
// }

// module.exports = new ReviewRepository();

const { Review, ReviewImage, user, Product, ProductImage } = require('../database/models');

class ReviewRepository {
  async create(data, images = []) {
    // 1. Create review first
    const review = await Review.create(data);

    // 2. Agar images array hai, to bulk create karein
    if (images.length > 0) {
      const imgData = images.map((fileUrl) => ({
        reviewId: review.id,
        fileUrl,
      }));
      await ReviewImage.bulkCreate(imgData);
    }

    // 3. Full review with images fetch kar ke return
    return await Review.findByPk(review.id, {
      include: [
        { model: ReviewImage, as: 'images' },
        { model: user, as: 'user', attributes: ['id','username','email'] },
      ],
    });
  }

  async findByProductId(productId) {
    return await Review.findAll({
      where: { productId },
      include: [
        { model: user, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: ReviewImage, as: 'images' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id) {
    return await Review.findByPk(id, {
      include: [{ model: ReviewImage, as: 'images' }]
    });
  }

  async delete(id) {
    return await Review.destroy({ where: { id } });
  }

  async update(id, data, images = []) {
    const [rowsUpdated] = await Review.update(data, { where: { id } });

    if (rowsUpdated > 0) {
      // Optional: Delete old images and add new ones
      if (images.length > 0) {
        await ReviewImage.destroy({ where: { reviewId: id } });
        const imgData = images.map((fileUrl) => ({ reviewId: id, fileUrl }));
        await ReviewImage.bulkCreate(imgData);
      }
      return await this.findById(id);
    }

    return null;
  }

  async findAll() {
    return await Review.findAll({
      include: [
        { model: user, as: 'user', attributes: ['id','username','email'] },
        { model: ReviewImage, as: 'images' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findAllPublic() {
    return await Review.findAll({
      include: [
        { model: user, as: 'user', attributes: ['id','username'] },
        { model: Product, as: 'product', attributes: ['productId','productName'], 
            include: [
          { model: ProductImage, as: 'images', attributes: ['fileUrl'] }
        ]},
        { model: ReviewImage, as: 'images' }
      ],
      order: [['createdAt','DESC']],
    });
  }
}

module.exports = new ReviewRepository();