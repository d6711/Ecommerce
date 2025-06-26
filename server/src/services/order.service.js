const { BadRequest } = require("../core/error.exception")
const { getUserById } = require("../helpers/auth.helper")
const { Order } = require("../models/order.model")

class OrderService {
    static async getOrders() {
        return await Order.find().lean()
    }
    static async getMyOrder({ userId }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')
        return await Order.find({ user: userId }).populate('orderItems')
    }
}

module.exports = OrderService