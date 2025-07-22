const Review = require("../models/review.model")
const Product = require('../models/product.model')
const { getUserById } = require("../helpers/auth.helper")
const { BadRequest } = require("../core/error.exception")

class ReviewService {
    static async calcRating(productId) {
        const product = await Product.findById(productId)
        if (!product) throw new BadRequest('Product not found')

        const reviews = await Review.find({ productId }).lean()

        const ratingCount = reviews.length
        const total = reviews.reduce((sum, r) => sum + r.rating, 0)
        const ratingAvg = ratingCount === 0 ? 0 : total / ratingCount

        product.ratingAvg = ratingAvg
        product.ratingCount = ratingCount
        await product.save()
    }
    static async createReview({ userId, productId, comment, rating }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        const product = await Product.findById(productId)
        if (!product) throw new BadRequest('Product not found')

        const review = await Review.findOneAndUpdate(
            { user: userId, productId },
            { rating, comment },
            { new: true, upsert: true }
        )
        await this.calcRating(productId)

        return review
    }
    static async deleteReview({ userId, productId }) {
        const review = await Review.findOne({ user: userId, productId })
        if (!review) throw new BadRequest('Review not found')

        const deleted = await Review.deleteOne({ user: userId, productId })
        await this.calcRating(productId)
        return deleted
    }
    static async updateReview({ userId, productId, comment, rating }) {
        const review = await Review.findOne({ user: userId, productId })
        if (!review) throw new BadRequest('Review not found')
        const updated = await Review.findOneAndUpdate(
            { user: userId, productId },
            { rating, comment },
            { new: true }
        )
        await this.calcRating(productId)
        return updated
    }
    static async getReviewByProductId(productId) {
        const product = await Product.findById(productId)
        if (!product) throw new BadRequest('Product not found')
        return await Review.find({ productId }).lean()
    }
    static async getReviewByUserId(userId) {
        return await Review.find({ user: userId }).lean()
    }
    static async getAllReviews() {
        return await Review.find().lean()
    }
    static async getReviewByRating(rating) {
        return await Review.find({ rating }).lean()
    }
}

module.exports = ReviewService