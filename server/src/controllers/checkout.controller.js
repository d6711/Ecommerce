const { Success } = require('../core/success.response')
const CheckoutService = require('../services/checkout')

class CheckoutController {
    async applyDiscount(req, res) {
        new Success({
            message: 'Apply discount code to cart successfully',
            metadata: await CheckoutService.applyDiscount(req.body)
        }).send(res)
    }
    async cancelCheckout(req, res) {
        new Success({
            message: 'Remove discount cart successfully',
            metadata: await CheckoutService.cancelCheckout({
                userId: req.user.userId,
                cartId: req.params.cartId
            })
        }).send(res)
    }
    async checkoutVnPay(req, res) {
        new Success({
            message: 'Checkout cart successfully',
            metadata: await CheckoutService.checkout({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async responseVnPay(req, res) {
        new Success({
            message: 'Checkout cart successfully',
            metadata: await CheckoutService.responseVnPay(req.query)
        }).send(res)
    }


}

module.exports = new CheckoutController()