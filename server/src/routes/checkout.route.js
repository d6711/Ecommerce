const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const { applyDiscountSchema } = require('../validations/cart.schema')
const checkoutController = require('../controllers/checkout.controller')


router.get('/vnpay-return', asyncHandler(checkoutController.responseVnPay))
router.use(authentication)

router.post('/apply-discount', validate(applyDiscountSchema), asyncHandler(checkoutController.applyDiscount))
router.post('/remove-discount/:cartId', asyncHandler(checkoutController.cancelCheckout))
router.post('/create-vnpay', asyncHandler(checkoutController.checkoutVnPay))

module.exports = router