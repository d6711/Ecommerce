const categoryController = require('@controllers/category.controller')
const { authentication } = require('@middlewares/auth')
const { asyncHandler, validate } = require('@middlewares/handleError')
const { Router } = require('express')
const router = Router()

router.get('/', asyncHandler(categoryController.getAllCategories))
router.get('/parent', asyncHandler(categoryController.getCategoryParent))
router.get('/:id', asyncHandler(categoryController.getCategoryById))
router.get('/:parentId/child', asyncHandler(categoryController.getSubCategories))


router.post('/', asyncHandler(categoryController.createCategory))
router.patch('/:id', asyncHandler(categoryController.updateCategory))
router.delete('/:id', asyncHandler(categoryController.deleteCategory))

module.exports = router