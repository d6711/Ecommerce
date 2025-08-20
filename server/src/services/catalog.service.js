const { BadRequest } = require("../core/error.exception")
const { pagination } = require("../helpers/dbQuery")
const { NewsCatalog } = require("../models/news.model")

class NewsCatalogService {
    static async createCatalog(body) {
        return await NewsCatalog.create(body)
    }

    static async updateCatalog(id, bodyUpdate) {
        const catalog = await NewsCatalog.findById(id)
        if (!catalog) throw new BadRequest('News catalog not found')

        return await NewsCatalog.findByIdAndUpdate(id, bodyUpdate, { new: true })
    }

    static async getCatalogs({ page, limit }) {
        return await pagination({
            model: NewsCatalog,
            page, limit,
        })
    }

    static async getAllCatalogs() {
        return await NewsCatalog.find({}).lean()
    }

    static async getCatalogById(id) {
        const catalog = await NewsCatalog.findById(id)
        if (!catalog) throw new BadRequest('News catalog not found')
        return catalog
    }

    static async deleteCatalog(id) {
        const catalog = await NewsCatalog.findById(id)
        if (!catalog) throw new BadRequest('News catalog not found')

        return await NewsCatalog.deleteOne({ _id: id })
    }
}

module.exports = NewsCatalogService
