const { BadRequest } = require("../core/error.exception")
const { pagination } = require("../helpers/dbQuery")
const Product = require("../models/product.model")
const CategoryService = require("./category.service")

class ProductService {
    static async createProduct(data) {
        await CategoryService.getCategoryById(data.categoryId)
        const product = await Product.findOne({ name: data.name.trim() })
        if (product) throw new BadRequest('Product name already exists')
        return await Product.create(data)
    }
    static async updateProduct(id, updateData) {
        const product = await Product.findById(id)
        if (!product) throw new BadRequest('Product not found')

        if (updateData.categoryId) {
            const category = await CategoryService.getCategoryById(updateData.categoryId)
            if (category) throw new BadRequest('Category not found')
        }
        if (updateData.name) {
            const existing = await Product.findOne({ name: updateData.name.trim(), _id: { $ne: id } })
            if (existing) throw new BadRequest('Product name already exists')
        }
        return await Product.findByIdAndUpdate(id, updateData, { new: true })
    }
    static async deleteProduct(id) {
        const product = await Product.findById(id)
        if (!product) throw new BadRequest('Product not found')
        return await Product.deleteOne({ _id: id })
    }
    static async getAllProducts() {
        return await Product.find().lean()
    }
    static async getProductById(id) {
        const product = await Product.findById(id)
        if (!product) throw new BadRequest('Product not found')
        return product
    }
    // Lấy sản phẩm theo danh mục
    static async getProductByCategoryId(categoryId) {
        await CategoryService.getCategoryById(categoryId)
        const categoryIds = await CategoryService.getArrayCategoryId(categoryId)
        return await Product.find({ categoryId: { $in: categoryIds } }).lean()
    }
    // Lấy sản phẩm nổi bật
    static async getFeaturedProducts(limit = 10) {
        return await Product.find({ isFeatured: true }).limit(limit).lean()
    }
    // Lấy sản phẩm bán chạy
    static async getBestSellers(limit = 10) {
        return await Product.find().sort({ soldCount: -1 }).limit(limit).lean()
    }
    static async activeProduct(id) {
        const product = await Product.findById(id)
        if (!product) throw new BadRequest('Product not found')
        return await Product.updateOne({ _id: id }, { isActive: true })
    }
    static async inactiveProduct(id) {
        const product = await Product.findById(id)
        if (!product) throw new BadRequest('Product not found')
        return await Product.updateOne({ _id: id }, { isActive: false })
    }
    static async getProductsByQuery({ search, page, limit, sortBy, order, minPrice, maxPrice, brand, tags, categoryId }) {
        const filter = {
            // isActive: true,
            ...(brand && { brand }),
            ...(tags && { tags: { $in: tags.split(",") } })
        }
        if (categoryId) {
            const categoryIds = await CategoryService.getArrayCategoryId(categoryId)
            filter.categoryId = { $in: categoryIds }
        }
        if (minPrice || maxPrice) {
            filter.price = {
                ...(minPrice && { $gte: minPrice }),
                ...(maxPrice && { $lte: maxPrice })
            }
        }
        console.log(filter)
        return await pagination({
            model: Product,
            search, searchFields: ['name', 'description', 'specification'],
            filter, page, limit, sortBy, order,
            select: "-__v -createdAt -updatedAt",
            populate: { path: 'categoryId', select: 'name' }
        })
    }
}

module.exports = ProductService