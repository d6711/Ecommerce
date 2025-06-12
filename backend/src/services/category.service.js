const { BadRequest } = require("@core/error.exception")
const { pagination } = require("@helpers/dbQuery")
const Category = require("@models/category.model")

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
        return await pagination({ model: Category, page, limit, filter: { parentId: { $ne: null } } })

    }
    static async getCategoryByParentId(parentId) {
        return await Category.find({ parentId }).select('-__v -createdAt -updatedAt -isActive')
    }
    static async getCategoryById(id) {
        return await Category.findById(id).select('-__v -createdAt -updatedAt -isActive')
    }
    static async deleteCategory(id) {
        return await Category.deleteMany({ $or: [{ parentId: id }, { _id: id }] })
    }

}

module.exports = CategoryService