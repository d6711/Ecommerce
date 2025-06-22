const { Success } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
    async addToCart(req, res) {
        new Success({
            message: 'Add to cart successfully',
            metadata: await CartService.addToCart({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async deleteCart(req, res) {
        new Success({
            message: 'Delete cart successfully',
            metadata: await CartService.deleteCart({
                userId: req.user.userId,
                cartId: req.params.cartId
            })
        }).send(res)
    }
    async updateCart(req, res) {
        new Success({
            message: 'Update cart successfully',
            metadata: await CartService.updateCart({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async getCartInfo(req, res) {
        new Success({
            message: 'Get info cart successfully',
            metadata: await CartService.getCartInfo(req.user)
        }).send(res)
    }
    async removeCartItem(req, res) {
        new Success({
            message: 'Remove cart item successfully',
            metadata: await CartService.removeCartItem({
                userId: req.user.userId,
                productId: req.query.productId
            })
        }).send(res)
    }
}

module.exports = new CartController()