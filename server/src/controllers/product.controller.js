const { Success } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController {
    getProductsByQuery = async (req, res) => {
        const { data, totalDocuments, totalPages, page, limit } = await ProductService.getProductsByQuery(req.query)
        new Success({
            message: 'Get list products by query successfully',
            pagination: { page, limit, totalDocuments, totalPages },
            metadata: data
        }).send(res)
    }
    getProductByCategoryId = async (req, res) => {
        new Success({
            message: 'Get list products by catId successfully',
            metadata: await ProductService.getProductByCategoryId(req.params.categoryId)
        }).send(res)
    }
    createProduct = async (req, res) => {
        new Success({
            message: 'Create product successfully',
            metadata: await ProductService.createProduct(req.body)
        }).send(res)
    }
    updateProduct = async (req, res) => {
        new Success({
            message: 'Update product successfully',
            metadata: await ProductService.updateProduct(req.params.id, req.body)
        }).send(res)
    }
    deleteProduct = async (req, res) => {
        new Success({
            message: 'Delete product successfully',
            metadata: await ProductService.deleteProduct(req.params.id)
        }).send(res)
    }
    getProductById = async (req, res) => {
        new Success({
            message: 'Get product successfully',
            metadata: await ProductService.getProductById(req.params.id)
        }).send(res)
    }
    getFeaturedProducts = async (req, res) => {
        new Success({
            message: 'Get product featured successfully',
            metadata: await ProductService.getFeaturedProducts(req.query.limit)
        }).send(res)
    }
    getBestSellers = async (req, res) => {
        new Success({
            message: 'Get products best seller successfully',
            metadata: await ProductService.getBestSellers(req.query.limit)
        }).send(res)
    }
    activeProduct = async (req, res) => {
        new Success({
            message: 'Active product successfully',
            metadata: await ProductService.activeProduct(req.params.id)
        }).send(res)
    }
    inactiveProduct = async (req, res) => {
        new Success({
            message: 'Deactive product successfully',
            metadata: await ProductService.inactiveProduct(req.params.id)
        }).send(res)
    }
}

module.exports = new ProductController()