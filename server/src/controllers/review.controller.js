const { Success } = require('../core/success.response')
const ReviewService = require('../services/review.service')

class ReviewController {
    async createReview(req, res) {
        new Success({
            message: 'Create review success',
            metadata: await ReviewService.createReview({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async updateReview(req, res) {
        new Success({
            message: 'Update review success',
            metadata: await ReviewService.updateReview({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async deleteReview(req, res) {
        new Success({
            message: 'Delete review success',
            metadata: await ReviewService.deleteReview({
                userId: req.user.userId,
                productId: req.query.productId
            })
        }).send(res)
    }
    async getReviewByProductId(req, res) {
        new Success({
            message: 'Get list product review success',
            metadata: await ReviewService.getReviewByProductId(req.query.productId)
        }).send(res)
    }
    async getReviewByUserId(req, res) {
        new Success({
            message: 'Get list review by user success',
            metadata: await ReviewService.getReviewByUserId(req.user.userId),
        }).send(res)
    }
    async getAllReviews(req, res) {
        new Success({
            message: 'Get all review success',
            metadata: await ReviewService.getAllReviews(),
        }).send(res)
    }
}

module.exports = new ReviewController()