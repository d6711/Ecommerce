const { Schema, Types, model } = require('mongoose')
const { Status } = require('../config/constants')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const CartSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        cartItems: [{ type: Types.ObjectId, ref: 'CartItem' }],
        totalOrder: { type: Number, min: 0, default: 0 },
        totalAmount: { type: Number, min: 0, default: 0 },
        discountCode: String,
        discountValue: Number,
        status: {
            type: String,
            enum: [Status.ACTIVE, Status.LOCKED, Status.COMPLETED],
            default: Status.ACTIVE
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)


const CartItemSchema = new Schema(
    {
        cartId: { type: Types.ObjectId, ref: 'Cart' },
        productId: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        name: String,
        image: String
    },
    {
        timestamps: true,
        collection: 'CartItems'
    }
)

CartSchema.index({ user: 1, status: 1 })
CartSchema.index({ user: 1 })
CartItemSchema.index({ cartId: 1 })
CartItemSchema.index({ cartId: 1, productId: 1 })

module.exports = {
    Cart: model(DOCUMENT_NAME, CartSchema),
    CartItem: model('CartItem', CartItemSchema),
}
