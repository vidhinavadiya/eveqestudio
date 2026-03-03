// const reviewRepository = require('../repositories/review.repository');

// class ReviewService {

//     async addReview(data) {

//         if (data.rating < 1 || data.rating > 5) {
//             throw new Error("Rating must be between 1 and 5");
//         }

//         return await reviewRepository.create(data);
//     }

//     async getProductReviews(productId) {
//         return await reviewRepository.findByProductId(productId);
//     }

//     async deleteReview(id) {
//         const review = await reviewRepository.findById(id);
//         if (!review) {
//             throw new Error("Review not found");
//         }

//         return await reviewRepository.delete(id);
//     }

//     async updateReview(id, data) {
//         return await reviewRepository.update(id, data);
//     }
//     async getAllReviews() {
//     return await reviewRepository.findAll();
// }
// async getAllPublicReviews() {
//     return await reviewRepository.findAllPublic();
// }
// }

// module.exports = new ReviewService();

const reviewRepository = require('../repositories/review.repository');

class ReviewService {
  async addReview(data, images = []) {
    if (data.rating < 1 || data.rating > 5) throw new Error("Rating must be between 1 and 5");
    return await reviewRepository.create(data, images);
  }

  async getProductReviews(productId) {
    return await reviewRepository.findByProductId(productId);
  }

  async deleteReview(id) {
    const review = await reviewRepository.findById(id);
    if (!review) throw new Error("Review not found");
    return await reviewRepository.delete(id);
  }

  async updateReview(id, data, images = []) {
    return await reviewRepository.update(id, data, images);
  }

  async getAllReviews() {
    return await reviewRepository.findAll();
  }

  async getAllPublicReviews() {
    return await reviewRepository.findAllPublic();
  }
}

module.exports = new ReviewService();