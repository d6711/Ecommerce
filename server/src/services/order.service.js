const { BadRequest } = require("../core/error.exception")
const { getUserById } = require("../helpers/auth.helper")
const { pagination } = require("../helpers/dbQuery")
const { Order } = require("../models/order.model")

class OrderService {
    static async getOrders({ page, limit }) {
        return await pagination({
            model: Order,
            page, limit,
            populate: [
                { path: 'user', select: 'name email' },
                {
                    path: 'orderItems',
                    populate: { path: 'productId', select: 'name price thumbnail' }
                }
            ]
        })
    }
    static async getMyOrder({ userId }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')
        return await Order.find({ user: userId }).populate('orderItems')
    }
    static async updateStatusOrder({ orderId, status }) {
        const order = await Order.findById(orderId)
        if (!order) throw new BadRequest('Order not found')
        return await Order.updateOne({ _id: orderId }, { status })
    }
}

module.exports = OrderService