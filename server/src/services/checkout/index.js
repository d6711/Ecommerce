const { Status, PaymentMethod, OrderStatus } = require("../../config/constants")
const { BadRequest } = require("../../core/error.exception")
const { getUserById } = require("../../helpers/auth.helper")
const { Cart } = require("../../models/cart.model")
const { Order, OrderItem } = require("../../models/order.model")
const CartService = require("../cart.service")
const DiscountService = require("../discount.service")
const { createMomo } = require("./momo")
const { createVnPay } = require("./vnpay")

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
                return createVnPay({ orderId: newOrder._id.toString(), amount: newOrder.totalAmount.toString() })
            case PaymentMethod.MOMO:
                return await createMomo({ orderId: newOrder._id.toString(), amount: newOrder.totalAmount.toString() })
            default:
                throw new BadRequest('Invalid method')
        }
    }
}

module.exports = CheckoutService
