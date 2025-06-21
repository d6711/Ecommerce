const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const discountController = require('../controllers/discount.controller')
const { applyDiscountSchema, createDiscountSchema, updateDiscountSchema } = require('../validations/discount.schema')

router.get('/', asyncHandler(discountController.getDiscountsByQuery))
router.get('/code', asyncHandler(discountController.getDiscountByCode))
router.get('/apply', validate(applyDiscountSchema), asyncHandler(discountController.applyDiscountToProduct))
router.get('/apply-list', asyncHandler(discountController.getProductWithDiscountApply))
router.get('/:id', asyncHandler(discountController.getDiscountById))

router.use(authentication)

router.post('/', validate(createDiscountSchema), asyncHandler(discountController.createDiscount))
router.patch('/:id', validate(updateDiscountSchema), asyncHandler(discountController.updateDiscount))
router.patch('/:id/active', asyncHandler(discountController.activeDiscount))
router.patch('/:id/inactive', asyncHandler(discountController.inactiveDiscount))
router.delete('/:id', asyncHandler(discountController.deleteDiscount))

module.exports = router