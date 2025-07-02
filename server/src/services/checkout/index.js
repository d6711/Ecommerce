const { Status, env, PaymentMethod, OrderStatus } = require("../../config/constants")
const { BadRequest } = require("../../core/error.exception")
const { getUserById } = require("../../helpers/auth.helper")
const { Cart } = require("../../models/cart.model")
const { Order, OrderItem } = require("../../models/order.model")
const CartService = require("../cart.service")
const DiscountService = require("../discount.service")
const { vnPayment, momoPayment } = require("./method.service")
const crypto = require('crypto')

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
    static async checkout({ userId, cartId, method, ...data }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        const cart = await Cart.findOne({ user: userId, _id: cartId }).populate('cartItems')
        if (!cart || !cart.cartItems) throw new BadRequest('Cart empty')

        const newOrder = new Order({
            totalOrder: cart.totalOrder,
            totalAmount: cart.totalAmount,
            discountCode: cart.discountCode,
            discountValue: cart.discountValue,
            paymentMethod: method,
            note: data.note,
            shippingAddress: data.address,
            status: OrderStatus.PENDING,
            user: userId,
        })
        await newOrder.save()

        const orderItems = cart.cartItems.map(item => ({
            orderId: newOrder._id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            thumnail: item.thumnail
        }))
        const createdOrderItems = await OrderItem.insertMany(orderItems)
        const orderItemIds = createdOrderItems.map(item => item._id)

        await Order.findByIdAndUpdate(newOrder._id, {
            orderItems: orderItemIds
        })
        await CartService.deleteCart({ cartId, userId })
        switch (method) {
            case PaymentMethod.VNPAY:
                return vnPayment({ orderId: newOrder._id, amount: newOrder.totalAmount })
            case PaymentMethod.MOMO:
                return await momoPayment({ orderId: newOrder._id, amount: newOrder.totalAmount })
            default:
                throw new BadRequest('Invalid method')
        }
    }
    static async responseVnPay(query) {
        const orderId = query.vnp_TxnRef
        if (query.vnp_ResponseCode !== '00') {
            await Order.updateOne({ _id: orderId }, { status: OrderStatus.FAILED })
            throw new BadRequest(`Failed to checkout, error response: ${query.vnp_ResponseCode}`)
        }
        await Order.updateOne({ _id: orderId }, { status: OrderStatus.PAID })
        return {
            orderInfo: query.vnp_OrderInfo,
            total: parseInt(query.vnp_Amount, 10) / 100,
            bankCode: query.vnp_BankCode,
            cardType: query.vnp_CardType,
        }
    }
    static async responseMomo(query) {
        const {
            partnerCode,
            orderId,
            orderInfo,
            requestId,
            amount,
            resultCode,
            extraData,
            signature
        } = query
        console.log(query)

        const momoConfig = {
            partnerCode: "MOMO",
            accessKey: "F8BBA842ECF85",
            secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
            redirectUrl: "http://localhost:3000/v1/api/checkout/momo/callback",
            ipnUrl: "http://localhost:3000/v1/api/checkout/momo/ipn",
            requestType: "captureWallet"
        }

        const rawSignature = `accessKey=${momoConfig.accessKey}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${momoConfig.ipnUrl}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&partnerCode=${partnerCode}` +
            `&redirectUrl=${momoConfig.redirectUrl}` +
            `&requestId=${requestId}` +
            `&requestType=${momoConfig.requestType}`

        const expectedSignature = crypto
            .createHmac('sha256', momoConfig.secretKey)
            .update(rawSignature)
            .digest('hex')
        console.log('return', rawSignature)
        if (signature !== expectedSignature) {
            throw new BadRequest('Momo signature verification failed')
        }
        if (resultCode === 0) {
            return { orderId, resultCode, amount }
        } else {
            throw new BadRequest('Failed to checkout')
        }
    }
}

module.exports = CheckoutService
