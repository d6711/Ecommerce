const { DiscountType, DiscountApplyType } = require("../config/constants")
const { BadRequest } = require("../core/error.exception")
const { pagination } = require("../helpers/dbQuery")
const Category = require("../models/category.model")
const Discount = require("../models/discount.model")
const Product = require("../models/product.model")
const { checkValidTime } = require("../utils")
const ProductService = require("./product.service")

class DiscountService {
    static async createDiscount(data) {
        const { code, startDate, endDate, type, value, applyTo, productId, categoryId } = data

        const discount = await Discount.findOne({ code })
        if (discount) throw new BadRequest('Discount code already exists!')

        if (startDate > endDate) throw new BadRequest("startDate must be before endDate")
        if (endDate < Date.now()) throw new BadRequest("endDate must be in the future")

        if (type === DiscountType.PERCENT && (value > 100 || value < 0)) {
            throw new BadRequest('Percent value must be between 0 and 100')
        }

        if (applyTo === DiscountApplyType.PRODUCT) {
            const products = await Product.find({ _id: { $in: productId } }).lean()
            if (products.length !== productId.length) throw new BadRequest('Invalid productId')
        }
        if (applyTo === DiscountApplyType.CATEGORY) {
            const categories = await Category.find({ _id: { $in: categoryId } }).lean()
            if (categories.length !== categoryId.length) throw new BadRequest('Invalid categoryId')
        }
        return await Discount.create(data)
    }
    static async updateDiscount(id, bodyUpdate) {
        const foundDiscount = await Discount.findById(id)
        if (!foundDiscount) throw new BadRequest('Discount code not found')

        const { code, startDate, endDate, type, value, applyTo, productId, categoryId, ...data } = bodyUpdate
        const discount = await Discount.findOne({ code, _id: { $ne: id } })
        if (discount) throw new BadRequest('Discount code already exists')

        if (startDate > endDate) throw new BadRequest("startDate must be before endDate")
        if (endDate < Date.now()) throw new BadRequest("endDate must be in the future")

        if (type === DiscountType.PERCENT && (value > 100 || value < 0)) {
            throw new BadRequest('Percentage value must be between 0 and 100')
        }

        if (applyTo === DiscountApplyType.PRODUCT) {
            const products = await Product.find({ _id: { $in: productId } }).lean()
            if (products.length !== productId.length) throw new BadRequest('Invalid productId')
        }
        if (applyTo === DiscountApplyType.CATEGORY) {
            const categories = await Category.find({ _id: { $in: categoryId } }).lean()
            if (categories.length !== categoryId.length) throw new BadRequest('Invalid categoryId')
        }
        return await Discount.findByIdAndUpdate(id, bodyUpdate, { new: true })
    }
    static async getDiscountById(id) {
        const discount = await Discount.findById(id)
        if (!discount) throw new BadRequest('Discount code not found')
    }
    static async getDiscountByCode(code) {
        const discount = await Discount.findOne({ code })
        if (!discount) throw new BadRequest('Discount code not found')
        return discount
    }
    static async deleteDiscount(id) {
        const discount = await Discount.findById(id)
        if (!discount) throw new BadRequest('Discount code not found')
        return await Discount.deleteOne({ _id: id })
    }
    static async getDiscountsByQuery({ search, page, limit, sortBy, order }) {
        return await pagination({
            model: Discount,
            search, searchFields: ['name', 'code'],
            page, limit, sortBy, order,
        })
    }
    static async activeDiscount(id) {
        const discount = await Discount.findById(id)
        if (!discount) throw new BadRequest('Discount code not found')
        return await Discount.updateOne({ _id: id }, { isActive: true })
    }
    static async inactiveDiscount(id) {
        const discount = await Discount.findById(id)
        if (!discount) throw new BadRequest('Discount code not found')
        return await Discount.updateOne({ _id: id }, { isActive: false })
    }
    // request: {code:xxx,products:[{productId,quantity,price}]}
    static async applyDiscountToProduct({ code, products }) {
        const discount = await Discount.findOne({ code, isActive: true })
        if (!discount) throw new BadRequest('Discount code not found')

        const { startDate, endDate, quantity, applyTo,
            productId, categoryId, minOrderValue, type, value, maxValue } = discount

        checkValidTime(startDate, endDate)
        if (!quantity) throw new BadRequest('Discount code quantity used up')
        if (applyTo === DiscountApplyType.PRODUCT) {
            const productIdValid = productId.map(id => id.toString())
            for (const p of products) {
                const isValid = productIdValid.includes(p.productId)
                if (!isValid) throw new BadRequest('Invalid product')
            }
        }
        if (applyTo === DiscountApplyType.CATEGORY) {
            for (const catId of categoryId) {
                const arrProducts = await ProductService.getProductByCategoryId(catId)
                const productIdValid = arrProducts.map(p => p._id.toString())
                const productIds = products.map(p => p.productId)
                const isValid = productIds.every(productId => productIdValid.includes(productId))
                if (!isValid) throw new BadRequest('Discount code not apply with product in category other')
            }
        }

        let totalOrder = 0
        for (const p of products) {
            const product = await Product.findById(p.productId)
            if (!product) throw new BadRequest(`ProductId ${p.productId} not valid`)
            if (product.stock < p.quantity) throw new BadRequest('Product quantity in stock not enough')
            if (product.price !== p.price) throw new BadRequest(`Product price of ${p.productId} not valid`)
            totalOrder += p.quantity * p.price
        }
        if (minOrderValue > totalOrder) throw new BadRequest(`Discount code require min order value of ${minOrderValue}`)
        const discountValue = type === DiscountType.FIXED
            ? value
            : Math.min(totalOrder * (value / 100), maxValue)

        return {
            totalOrder,
            discountValue,
            totalAmount: totalOrder - discountValue
        }
    }
    static async getProductWithDiscountApply({ code, page, limit, sortBy, order, search }) {
        const discount = await Discount.findOne({ code, isActive: true })
        if (!discount) throw new BadRequest('Discount code not found')
        let { applyTo, productId, categoryId } = discount
        if (applyTo === DiscountApplyType.PRODUCT) {
            return await pagination({
                model: Product,
                filter: { _id: { $in: productId } },
                search, sortBy, order, page, limit,
            })
        }
        if (applyTo === DiscountApplyType.CATEGORY) {
            return await pagination({
                model: Product,
                filter: { categoryId: { $in: categoryId } },
                search, sortBy, order, page, limit,
            })
        }
        return await pagination({
            model: Product,
            search, sortBy, order, page, limit,
        })
    }
}

module.exports = DiscountService

