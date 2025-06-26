const { Schema, Types, model } = require('mongoose')
const { OrderStatus, PaymentMethod } = require('../config/constants')

const OrderSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        // itemsCount: { type: Number, required: true },
        totalOrder: { type: Number, required: true, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },
        orderItems: [{ type: Types.ObjectId, ref: 'OrderItem', default: [] }],
        discountCode: { type: String, default: null },
        discountValue: { type: Number, default: 0 },
        note: String,
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.CONFIRMED
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            default: PaymentMethod.COD
        },
        shippingAddress: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: 'Orders'
    }
)

const OrderItemSchema = new Schema(
    {
        orderId: { type: Types.ObjectId, ref: 'Order', required: true },
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        name: { type: String, required: true },
        thumnail: { type: String, default: '' }
    },
    {
        timestamps: true,
        collection: 'OrderItems'
    }
)

module.exports = {
    Order: model('Order', OrderSchema),
    OrderItem: model('OrderItem', OrderItemSchema)
}
