const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'Review'
const COLLECTION_NAME = 'Reviews'

const ReviewSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true, default: 5 },
    comment: { type: String, default: 'Good' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

ReviewSchema.index({ user: 1, productId: 1 })

const Review = model(DOCUMENT_NAME, ReviewSchema)
module.exports = Review
