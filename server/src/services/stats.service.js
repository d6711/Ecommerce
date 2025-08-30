const AuthService = require("./auth.service")
const OrderService = require("./order.service")
const ProductService = require("./product.service")

class StatsService {
    static async getStats() {
        const orders = await OrderService.getAllOrders()
        const totalUsers = await AuthService.totalUser()
        const totalProducts = await ProductService.totalProducts()
        const revenue = orders.reduce((total, order) => total + order.totalAmount, 0)
        return {
            revenue,
            orders: orders.length,
            users: totalUsers,
            products: totalProducts
        }
    }
}

module.exports = StatsService