const { Success } = require("../core/success.response")
const NewsCatalogService = require("../services/catalog.service")

class NewsCatalog {
    async createCatalog(req, res) {
        new Success({
            message: 'Create news catalog successfully',
            metadata: await NewsCatalogService.createCatalog(req.body)
        }).send(res)
    }
    async updateCatalog(req, res) {
        new Success({
            message: 'Update news catalog successfully',
            metadata: await NewsCatalogService.updateCatalog(req.params.id, req.body)
        }).send(res)
    }
    async getCatalogs(req, res) {
        const { data, page, limit, totalDocuments, totalPages } = await NewsCatalogService.getCatalogs(req.query)
        new Success({
            message: 'Get catalog successfully',
            metadata: data,
            pagination: { page, limit, totalDocuments, totalPages }
        }).send(res)
    }
    async getCatalogById(req, res) {
        new Success({
            message: 'Get news catalog by id successfully',
            metadata: await NewsCatalogService.getCatalogById(req.params.id)
        }).send(res)
    }
    async deleteCatalog(req, res) {
        new Success({
            message: 'Delete news catalog successfully',
            metadata: await NewsCatalogService.deleteCatalog(req.params.id)
        }).send(res)
    }
}

module.exports = new NewsCatalog()