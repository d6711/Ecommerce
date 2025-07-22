const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const newsController = require('../controllers/news.controller')

router.get('/', asyncHandler(newsController.getNewsList))
router.get('/:id', asyncHandler(newsController.getNewsById))

router.use(authentication)

router.post('/', asyncHandler(newsController.createNews))
router.patch('/:id', asyncHandler(newsController.updateNews))
router.delete('/:id', asyncHandler(newsController.deleteNews))

module.exports = router