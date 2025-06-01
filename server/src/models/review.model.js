const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'Review'
const COLLECTION_NAME = 'Reviews'

const ReviewSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// Mỗi user chỉ review 1 lần trên mỗi product
ReviewSchema.index({ user: 1, productId: 1 }, { unique: true })

module.exports = {
    Review: model(DOCUMENT_NAME, ReviewSchema)
}
