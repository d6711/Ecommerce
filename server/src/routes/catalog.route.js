const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const catalogController = require('../controllers/catalog.controller')

router.get('/', asyncHandler(catalogController.getCatalogs))
router.get('/:id', asyncHandler(catalogController.getCatalogById))

router.use(authentication)

router.post('/', asyncHandler(catalogController.createCatalog))
router.patch('/:id', asyncHandler(catalogController.updateCatalog))
router.delete('/:id', asyncHandler(catalogController.deleteCatalog))

module.exports = router