const { Success } = require("../core/success.response")
const NewsService = require("../services/news.service")

class NewsController {
    async createNews(req, res) {
        new Success({
            message: 'Create news successfully',
            metadata: await NewsService.createNews({
                author: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async updateNews(req, res) {
        new Success({
            message: 'Update news successfully',
            metadata: await NewsService.updateNews(req.params.id, {
                author: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    async getNewsList(req, res) {
        const { data, page, limit, totalDocuments, totalPages } = await NewsService.getNewsList(req.query)
        new Success({
            message: 'Get newslist successfully',
            metadata: data,
            pagination: { page, limit, totalDocuments, totalPages }
        }).send(res)
    }
    async getNewsById(req, res) {
        new Success({
            message: 'Get news by id successfully',
            metadata: await NewsService.getNewsById(req.params.id)
        }).send(res)
    }
    async deleteNews(req, res) {
        new Success({
            message: 'Delete news successfully',
            metadata: await NewsService.deleteNews(req.params.id)
        }).send(res)
    }
}

module.exports = new NewsController()