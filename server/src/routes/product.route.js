const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const productController = require('../controllers/product.controller')
const { createProduct, updateProduct } = require('../validations/product.schema')
const { grantAccess } = require('../middlewares/rbac')

router.get('/featured', asyncHandler(productController.getFeaturedProducts))
router.get('/best-sellers', asyncHandler(productController.getBestSellers))
router.get('/', asyncHandler(productController.getProductsByQuery))
router.get('/:id', asyncHandler(productController.getProductById))

router.use(authentication)

router.post('/',
    grantAccess('createAny', 'product'),
    validate(createProduct),
    asyncHandler(productController.createProduct))

router.patch('/:id',
    grantAccess('updateAny', 'product'),
    validate(updateProduct),
    asyncHandler(productController.updateProduct))

router.patch('/:id/active',
    grantAccess('updateAny', 'product'),
    asyncHandler(productController.activeProduct))

router.patch('/:id/inactive',
    grantAccess('updateAny', 'product'),
    asyncHandler(productController.inactiveProduct))

router.delete('/:id',
    grantAccess('deleteAny', 'product'),
    asyncHandler(productController.deleteProduct))

module.exports = router