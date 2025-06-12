const { Success } = require("@core/success.response")
const CategoryService = require("@services/category.service")

class CategoryController {
    async getAllCategories(req, res) {
        const { data, page, limit, totalDocuments, totalPages } = await CategoryService.getCategories(req.query)
        new Success({
            message: 'Get all categories successfully',
            pagination: { page, limit, totalDocuments, totalPages },
            metadata: data
        }).send(res)
    }
    async getSubCategories(req, res) {
        new Success({
            message: 'Get sub categories successfully',
            metadata: await CategoryService.getCategoryByParentId(req.params.parentId)
        }).send(res)
    }
    async createCategory(req, res) {
        console.log(req.body)
        new Success({
            message: 'Create category successfully',
            metadata: await CategoryService.createCategory(req.body)
        }).send(res)
    }
    async updateCategory(req, res) {
        new Success({
            message: 'Update category successfully',
            metadata: await CategoryService.updateCategory(req.params.id, req.body)
        }).send(res)
    }
    async getCategoryById(req, res) {
        new Success({
            message: 'Get category successfully',
            metadata: await CategoryService.getCategoryById(req.params.id)
        }).send(res)
    }
    async deleteCategory(req, res) {
        new Success({
            message: 'Delete category successfully',
            metadata: await CategoryService.deleteCategory(req.params.id)
        }).send(res)
    }
}

module.exports = new CategoryController()