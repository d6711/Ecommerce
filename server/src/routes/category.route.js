const categoryController = require('../controllers/category.controller')
const productController = require('../controllers/product.controller')
const { authentication } = require('../middlewares/auth')
const { asyncHandler, validate } = require('../middlewares/handleError')
const { Router } = require('express')
const { createCategory, updateCategory } = require('../validations/category.schema')
const { grantAccess } = require('../middlewares/rbac')
const router = Router()

router.get('/', asyncHandler(categoryController.getAllCategories))
router.get('/parent', asyncHandler(categoryController.getCategoryParent))
router.get('/:id', asyncHandler(categoryController.getCategoryById))
router.get('/:parentId/child', asyncHandler(categoryController.getSubCategories))
router.get('/:categoryId/products', asyncHandler(productController.getProductByCategoryId))

router.use(authentication)

router.post('/', grantAccess('createAny', 'category'), validate(createCategory), asyncHandler(categoryController.createCategory))
router.patch('/:id', grantAccess('updateAny', 'category'), validate(updateCategory), asyncHandler(categoryController.updateCategory))
router.delete('/:id', grantAccess('deleteAny', 'category'), asyncHandler(categoryController.deleteCategory))

module.exports = router