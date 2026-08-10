const reviewService = require('../services/review.service');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

class ReviewController {

    // CREATE REVIEW
    async create(req, res) {
        try {

            const images = [];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {

                    const uploadedImage = await uploadToCloudinary(
                        file.buffer,
                        'eveqe/reviews'
                    );

                    images.push(uploadedImage.secure_url);
                }
            }

            const review = await reviewService.addReview(
                req.body,
                images
            );

            return res.status(201).json({
                success: true,
                message: 'Review added successfully',
                data: review
            });

        } catch (error) {

            console.error('Review Create Error:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


    // UPDATE REVIEW
    async update(req, res) {
        try {

            const images = [];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {

                    const uploadedImage = await uploadToCloudinary(
                        file.buffer,
                        'eveqe/reviews'
                    );

                    images.push(uploadedImage.secure_url);
                }
            }

            const updated = await reviewService.updateReview(
                req.params.id,
                req.body,
                images
            );

            return res.status(200).json({
                success: true,
                message: 'Review updated successfully',
                data: updated
            });

        } catch (error) {

            console.error('Review Update Error:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


    // GET BY PRODUCT
    async getByProduct(req, res) {
        try {

            const { productId } = req.params;

            const reviews =
                await reviewService.getProductReviews(productId);

            return res.status(200).json({
                success: true,
                data: reviews
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // DELETE REVIEW
    async delete(req, res) {
        try {

            await reviewService.deleteReview(req.params.id);

            return res.status(200).json({
                success: true,
                message: 'Review deleted successfully'
            });

        } catch (error) {

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }


    // GET ALL REVIEWS
    async getAll(req, res) {
        try {

            const reviews =
                await reviewService.getAllReviews();

            return res.status(200).json({
                success: true,
                data: reviews
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // GET ALL PUBLIC REVIEWS
    async getAllPublic(req, res) {
        try {

            const reviews =
                await reviewService.getAllPublicReviews();

            return res.status(200).json({
                success: true,
                data: reviews
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ReviewController();