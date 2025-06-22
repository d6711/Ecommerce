const { Status } = require("../config/constants")
const { BadRequest } = require("../core/error.exception")
const { getUserById } = require("../helpers/auth.helper")
const { Cart, CartItem } = require("../models/cart.model")
const Product = require("../models/product.model")

class CartService {
    static async calcTotalOrder({ userId }) {
        const cart = await Cart.findOne({ user: userId, status: Status.ACTIVE }).populate('cartItems').lean()
        const totalOrder = cart.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
        return await Cart.findOneAndUpdate(
            { user: userId, status: Status.ACTIVE },
            { totalOrder, totalAmount: totalOrder },
            { new: true }
        )
    }
    static async addToCart({ userId, productId, quantity }) {
        const product = await Product.findById(productId)
        if (!product) throw new BadRequest('Product not found')

        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        let cart = await Cart.findOne({ user: userId, status: Status.ACTIVE })
        if (cart.status !== Status.ACTIVE) throw new BadRequest('Cart is locked, cannot add to cart')

        if (!cart) cart = await Cart.create({ user: userId })

        let cartItem = await CartItem.findOneAndUpdate(
            { cartId: cart._id, productId },
            {
                $inc: { quantity },
                name: product.name,
                price: product.price,
                image: product.images[0]
            },
            { new: true, upsert: true }
        )

        cart = await Cart.updateOne(
            { user: userId },
            { $addToSet: { cartItems: cartItem._id } }
        )
        return await CartService.calcTotalOrder({ userId })
    }
    static deleteCart = async ({ userId, cartId }) => {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        const foundCart = await Cart.findById(cartId)
        if (!foundCart || !foundCart.cartItems) throw new BadRequest('Cart empty')

        const [cart, items] = await Promise.all([
            Cart.deleteOne({ _id: cartId }),
            CartItem.deleteMany({ cartId })
        ])

        return {
            deletedCart: cart.deletedCount,
            deletedItems: items.deletedCount
        }
    }
    static async updateCart({ userId, productId, quantity }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        const cart = await Cart.findOne({ user: userId, status: Status.ACTIVE })
        if (!cart) throw new BadRequest('Cart empty')

        if (cart.status !== Status.ACTIVE) throw new BadRequest('Cart is locked, cannot update cart')

        let cartItem = await CartItem.findOne({ cartId: cart._id, productId })
        if (!cartItem) throw new BadRequest('Product has not added to cart')

        if (quantity > 0) {
            cartItem = await CartItem.updateOne(
                { cartId: cart._id, productId },
                { $inc: { quantity } }
            )
            return await CartService.calcTotalOrder({ userId })
        }
        const newQuantity = cartItem.quantity + quantity
        let totalSub = cartItem.quantity * cartItem.price
        if (newQuantity <= 0) {
            await Cart.updateOne({ _id: cart._id }, {
                $pull: { cartItems: cartItem._id },
                $inc: {
                    totalOrder: -totalSub,
                    totalAmount: -totalSub
                },
            })
            const deleted = await CartItem.deleteOne({ cartId: cart._id, productId })
            return deleted
        }
        // newQuantity > 0
        const updated = await CartItem.findOneAndUpdate({ cartId: cart._id, productId }, {
            $set: { quantity: newQuantity }
        }, { new: true })
        await CartService.calcTotalOrder({ userId })
        return updated
    }
    static async getCartInfo({ userId }) {
        if (!user) throw new BadRequest('User not found')

        const cart = await Cart.findOne({ user: userId, status: Status.ACTIVE }).populate('cartItems').lean()
        if (!cart) throw new BadRequest('Cart empty')
        return cart
    }
    static async removeCartItem({ userId, productId }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        const product = await Product.findById(productId)
        if (!product) throw new BadRequest('Product not found')

        const cart = await Cart.findOne({ user: userId, status: Status.ACTIVE })
        if (!cart) throw new BadRequest('Cart empty')

        if (cart.status !== Status.ACTIVE) throw new BadRequest('Cart is locked, cannot update cart')

        const cartItem = await CartItem.findOne({ cartId: cart._id, productId })
        if (!cartItem) throw new BadRequest('Product has not added to cart')

        const totalSub = cartItem.quantity * cartItem.price
        await Cart.updateOne({ _id: cart._id, status: Status.ACTIVE }, {
            $pull: { cartItems: cartItem._id },
            $inc: {
                totalOrder: -totalSub,
                totalAmount: -totalSub
            },
        })
        const deleted = await CartItem.deleteOne({ cartId: cart._id, productId })
        return deleted
    }

}

module.exports = CartService

