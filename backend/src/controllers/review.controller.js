const reviewService = require('../services/review.service');

class ReviewController {

    // async create(req, res) {
    //     try {
    //         const review = await reviewService.addReview(req.body);
    //         return res.status(201).json({
    //             success: true,
    //             message: "Review added successfully",
    //             data: review
    //         });
    //     } catch (error) {
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

      async create(req, res) {
    try {
      const images = req.files?.map(file => `/uploads/reviews/${file.filename}`) || [];
      const review = await reviewService.addReview(req.body, images);

      return res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const images = req.files?.map(file => `/uploads/reviews/${file.filename}`) || [];
      const updated = await reviewService.updateReview(req.params.id, req.body, images);

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: updated
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }


    async getByProduct(req, res) {
        try {
            const { productId } = req.params;
            const reviews = await reviewService.getProductReviews(productId);

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

    async delete(req, res) {
        try {
            await reviewService.deleteReview(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Review deleted successfully"
            });

        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // async update(req, res) {
    //     try {
    //         const updated = await reviewService.updateReview(req.params.id, req.body);

    //         return res.status(200).json({
    //             success: true,
    //             message: "Review updated successfully",
    //             data: updated
    //         });

    //     } catch (error) {
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }
    async getAll(req, res) {
    try {
        const reviews = await reviewService.getAllReviews();
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
async getAllPublic(req, res) {
    try {
        const reviews = await reviewService.getAllPublicReviews();

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