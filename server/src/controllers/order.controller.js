const { Success } = require("../core/success.response")
const OrderService = require("../services/order.service")

class OrderController {
    async getOrders(req, res) {
        new Success({
            message: 'Get all orders successfully',
            metadata: await OrderService.getOrders()
        }).send(res)
    }
    async getMyOrder(req, res) {
        new Success({
            message: 'Get my order successfully',
            metadata: await OrderService.getMyOrder({
                userId: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new OrderController()