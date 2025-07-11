const { BadRequest } = require("../core/error.exception")
const { pagination } = require("../helpers/dbQuery")
const Category = require("../models/category.model")

class CategoryService {
    static async createCategory({ parentId = null, ...body }) {
        if (parentId) {
            const category = await Category.findById(parentId)
            if (!category) throw new BadRequest('Parent category not found')
        }
        return await Category.create({ parentId, ...body })
    }
    static async updateCategory(id, bodyUpdate) {
        const category = await Category.findById(id)
        if (!category) throw new BadRequest('Category not found')

        if (bodyUpdate.parentId) {
            const category = await Category.findById(bodyUpdate.parentId)
            if (!category) throw new BadRequest('Parent category not found')
        }
        return await Category.findByIdAndUpdate(id, bodyUpdate, { new: true })
    }
    static async getCategories({ page, limit }) {
        return await pagination({
            model: Category,
            page, limit,
            filter: {},
            populate: { path: 'parentId', select: 'name' }
        })
    }
    static async getCategoryById(id) {
        const category = await Category.findById(id)
        if (!category) throw new BadRequest('Category not found')
        return category
    }
    static async deleteCategory(id) {
        const category = await Category.findById(id)
        if (!category) throw new BadRequest('Category not found')
        return await Category.deleteMany({ $or: [{ parentId: id }, { _id: id }] })
    }
    // Lấy danh sách danh mục cha
    static async getCategoryParent() {
        return await Category.find({ parentId: null }).lean()
    }
    // Lấy danh sách danh mục con bằng parentId
    static async getCategoryByParentId(parentId) {
        return await Category.find({ parentId }).lean()
    }
    // Lấy mảng categoryId thuộc danh mục cha
    static async getArrayCategoryId(parentId) {
        const categories = await Category.find({ parentId }).lean()
        const categoryIds = [parentId, ...categories.map(category => category._id.toString())]
        return categoryIds
    }
}

module.exports = CategoryService