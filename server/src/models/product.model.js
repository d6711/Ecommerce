const { Schema, Types, model } = require('mongoose')
const { generateSlug } = require('../utils')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        images: { type: Array, default: [] },
        price: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        ratingAvg: { type: Number, default: 5 },
        ratingCount: { type: Number, default: 0 },
        slug: String,
        description: String,
        specification: String,
        brand: String,
        tags: { type: Array, default: [] },
        categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false }, // Đánh dấu sản phẩm nổi bật
        soldCount: { type: Number, default: 0 } // Đếm số lượng đã bán
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)
ProductSchema.index({ name: 'text' })

ProductSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = generateSlug(this.name)
    }
    next()
})

ProductSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate()
    if (update.name && !update.slug) {
        update.slug = generateSlug(update.name)
    }
    next()
})

const Product = model(DOCUMENT_NAME, ProductSchema)
module.exports = Product