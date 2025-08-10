const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const newsController = require('../controllers/news.controller')
const { grantAccess } = require('../middlewares/rbac')

router.get('/', asyncHandler(newsController.getNewsList))
router.get('/:id', asyncHandler(newsController.getNewsById))

router.use(authentication)

router.post('/', grantAccess('createAny', 'news'), asyncHandler(newsController.createNews))
router.patch('/:id', grantAccess('updateAny', 'news'), asyncHandler(newsController.updateNews))
router.delete('/:id', grantAccess('deleteAny', 'news'), asyncHandler(newsController.deleteNews))

module.exports = router