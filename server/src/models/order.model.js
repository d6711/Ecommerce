// const { Schema, Types, model } = require('mongoose')

// const OrderSchema = new Schema(
//     {
//         user: { type: Types.ObjectId, ref: 'User', required: true },
//         itemsCount: { type: Number, required: true },
//         totalAmount: { type: Number, required: true, min: 0 },
//         orderItems: [{ type: Types.ObjectId, ref: 'OrderItem', default: [] }],
//         discountCode: { type: String, default: null },
//         discountValue: { type: Number, default: 0 },
//         note: String,
//         status: { type: String, default: 'Pending' },
//         paymentMethod: { type: String, default: 'COD' },
//         shippingAddress: { type: String, required: true },
//     },
//     {
//         timestamps: true,
//         collection: 'Orders'
//     }
// )

// exports.Order = model('Order', OrderSchema)

// const OrderItemSchema = new Schema(
//     {
//         orderId: { type: Types.ObjectId, ref: 'Order', required: true },
//         productId: { type: Types.ObjectId, ref: 'Product', required: true },
//         quantity: { type: Number, required: true, min: 1 },
//         price: { type: Number, required: true, min: 0 },
//         name: { type: String, required: true },
//         thumnail: { type: String, default: '' }
//     },
//     {
//         timestamps: true,
//         collection: 'OrderItems'
//     }
// )

// exports.OrderItem = model('OrderItem', OrderItemSchema)
