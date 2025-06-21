const { Success } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {
    async createDiscount(req, res) {
        new Success({
            message: 'Create discount code success',
            metadata: await DiscountService.createDiscount(req.body)
        }).send(res)
    }
    async updateDiscount(req, res) {
        new Success({
            message: 'Update discount code success',
            metadata: await DiscountService.updateDiscount(req.params.id, req.body)
        }).send(res)
    }
    async deleteDiscount(req, res) {
        new Success({
            message: 'Delete discount code success',
            metadata: await DiscountService.deleteDiscount(req.params.id)
        }).send(res)
    }
    async getDiscountsByQuery(req, res) {
        new Success({
            message: 'Get discount code success',
            metadata: await DiscountService.getDiscountsByQuery(req.query)
        }).send(res)
    }
    async getDiscountById(req, res) {
        new Success({
            message: 'Get discount code success',
            metadata: await DiscountService.getDiscountById(req.params.id)
        }).send(res)
    }
    async getDiscountByCode(req, res) {
        new Success({
            message: 'Get discount code success',
            metadata: await DiscountService.getDiscountByCode(req.query.code)
        }).send(res)
    }
    async activeDiscount(req, res) {
        new Success({
            message: 'Active discount code success',
            metadata: await DiscountService.activeDiscount(req.params.id)
        }).send(res)
    }
    async inactiveDiscount(req, res) {
        new Success({
            message: 'Deactive discount code success',
            metadata: await DiscountService.inactiveDiscount(req.params.id)
        }).send(res)
    }
    async applyDiscountToProduct(req, res) {
        new Success({
            message: 'Apply discount code success',
            metadata: await DiscountService.applyDiscountToProduct(req.body)
        }).send(res)
    }
    async getProductWithDiscountApply(req, res) {
        const { data, page, limit, totalDocuments, totalPages } = await DiscountService.getProductWithDiscountApply(req.query)
        new Success({
            message: 'Get products discount apply code success',
            pagination: { page, limit, totalDocuments, totalPages },
            metadata: data
        }).send(res)
    }
}

module.exports = new DiscountController()