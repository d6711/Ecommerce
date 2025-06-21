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
    deleteCart = async (req, res) => {
        new Success({
            message: 'Delete cart successfully',
            metadata: await CartService.deleteCart({
                userId: req.user.userId,
                cartId: req.params.cartId
            })
        }).send(res)
    }
    updateCart = async (req, res) => {
        new Success({
            message: 'Update cart successfully',
            metadata: await CartService.updateCart({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    applyDiscountToCart = async (req, res) => {
        new Success({
            message: 'Apply discount code to cart successfully',
            metadata: await CartService.applyDiscountToCart(req.body)
        }).send(res)
    }
    getCartInfo = async (req, res) => {
        new Success({
            message: 'Get info cart successfully',
            metadata: await CartService.getCartInfo(req.user)
        }).send(res)
    }
    removeCartItem = async (req, res) => {
        new Success({
            message: 'Remove cart item successfully',
            metadata: await CartService.removeCartItem({
                userId: req.user.userId,
                productId: req.query.productId
            })
        }).send(res)
    }
    removeDiscount = async (req, res) => {
        new Success({
            message: 'Remove discount cart successfully',
            metadata: await CartService.removeDiscount({
                userId: req.user.userId,
                cartId: req.params.cartId
            })
        }).send(res)
    }
    // checkoutCart = async (req, res) => {
    //     new Success({
    //         message: 'Checkout cart successfully',
    //         metadata: await CartService.checkoutCart(req.user.userId)
    //     }).send(res)
    // }

}

module.exports = new CartController()