const { Status, env } = require("../config/constants")
const { BadRequest } = require("../core/error.exception")
const { getUserById } = require("../helpers/auth.helper")
const { Cart } = require("../models/cart.model")
const DiscountService = require("./discount.service")
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay')

class CheckoutService {
    static async applyDiscount({ discountCode, cartId }) {
        const cart = await Cart.findOne({ _id: cartId }).populate('cartItems')
        if (!cart || !cart.cartItems) throw new BadRequest('Cart empty')

        const arrProducts = cart.cartItems.map(cartItem => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price
        }))
        const { totalOrder, totalAmount, discountValue } = await DiscountService.applyDiscountToProduct({
            code: discountCode,
            products: arrProducts
        })
        cart.discountCode = discountCode
        cart.discountValue = discountValue
        cart.totalOrder = totalOrder
        cart.totalAmount = totalAmount
        cart.status = Status.LOCKED
        await cart.save()

        return {
            totalOrder,
            discountCode,
            discountValue,
            totalAmount
        }
    }
    static async cancelCheckout({ userId, cartId }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        let cart = await Cart.findById(cartId)
        if (!cart || !cart.cartItems) throw new BadRequest('Cart empty')

        if (cart.discountCode) return await Cart.findByIdAndUpdate(cartId, {
            $set: {
                discountCode: null,
                discountValue: 0,
                totalAmount: cart.totalOrder,
                status: Status.ACTIVE
            },
        }, { new: true })
    }
    static async prepareCheckout(userId, paymentMethod) { }
    static async handlePaymentRedirect(userId, paymentResponse) { }
    static async confirmCheckout(userId) { }
    static async checkoutVnPay() {
        const vnpay = new VNPay({
            tmnCode: env.VNP_TMN_CODE,
            secureSecret: env.VNP_HASH_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,


        })
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: 10000,
            vnp_IpAddr: '13.160.92.202',
            vnp_TxnRef: '1234561',
            vnp_OrderInfo: 'Thanh toan don hang 123456',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:3000/v1/api/checkout/vnpay-return',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
        })

        return { paymentUrl }
    }
    static async returnVnpay(query) {
        console.log(query)
        return query
    }
}

module.exports = CheckoutService
