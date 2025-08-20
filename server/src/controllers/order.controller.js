const { Success } = require("../core/success.response")
const OrderService = require("../services/order.service")

class OrderController {
    async getOrders(req, res) {
        const { data, page, limit, totalDocuments, totalPages } = await OrderService.getOrders(req.query)
        new Success({
            message: 'Get all orders successfully',
            pagination: { page, limit, totalDocuments, totalPages },
            metadata: data
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
    async updateStatusOrder(req, res) {
        new Success({
            message: 'Update status order successfully',
            metadata: await OrderService.updateStatusOrder({
                orderId: req.params.id,
                status: req.body.status
            })
        }).send(res)
    }
}

module.exports = new OrderController()