const { BadRequest } = require("../core/error.exception")
const { pagination } = require("../helpers/dbQuery")
const { News, NewsCatalog } = require("../models/news.model")

class NewsService {
    static async createNews(body) {
        if (body.catalog) {
            const catalog = await NewsCatalog.findById(body.catalog)
            if (!catalog) throw new BadRequest('Catalog not found')
        }

        return await News.create(body)
    }

    static async updateNews(id, bodyUpdate) {
        const news = await News.findById(id)
        if (!news) throw new BadRequest('News not found')

        if (bodyUpdate.catalog) {
            const catalog = await NewsCatalog.findById(bodyUpdate.catalog)
            if (!catalog) throw new BadRequest('Catalog not found')
        }

        return await News.findByIdAndUpdate(id, bodyUpdate, { new: true })
    }

    static async getNewsList({ page = 1, limit = 10 }) {
        return await pagination({
            model: News,
            page,
            limit,
            populate: [
                { path: 'catalog', select: 'name' },
                { path: 'author', select: 'name email' },
            ],
        })
    }

    static async getNewsById(id) {
        const news = await News.findById(id)
            .populate('catalog', 'name')
            .populate('author', 'name email')

        if (!news) throw new BadRequest('News not found')
        return news
    }

    static async deleteNews(id) {
        const news = await News.findById(id)
        if (!news) throw new BadRequest('News not found')
        return await News.deleteOne({ _id: id })
    }
}

module.exports = NewsService
