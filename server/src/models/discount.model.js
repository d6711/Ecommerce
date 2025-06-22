const { Schema, Types, model } = require('mongoose')
const { DiscountType, DiscountApplyType } = require('../config/constants')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const DiscountSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        code: { type: String, required: true, uppercase: true },
        type: { type: String, enum: [DiscountType.PERCENT, DiscountType.FIXED], default: DiscountType.PERCENT },
        value: { type: Number, required: true, min: 0 },
        maxValue: { type: Number, min: 0 }, // apply percentage
        minOrderValue: { type: Number, min: 0, default: 0 },
        maxUsePerUser: { type: Number, min: 1, default: 1 }, // số lần user có thể sử dụng
        usedCount: { type: Number, default: 0 }, // số lần đã dùng
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, required: true },
        quantity: { type: Number, required: true, min: 0 }, // số lượng discount
        applyTo: {
            type: String,
            enum: [DiscountApplyType.ALL, DiscountApplyType.CATEGORY, DiscountApplyType.PRODUCT],
            default: DiscountApplyType.ALL
        },
        productId: [{ type: Types.ObjectId, ref: 'Product', default: [] }],
        categoryId: [{ type: Types.ObjectId, ref: 'Category', default: [] }],
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

DiscountSchema.index({ code: 1 }, { unique: true })
DiscountSchema.index({ code: 'text', name: 'text' })

const Discount = model(DOCUMENT_NAME, DiscountSchema)
module.exports = Discount