const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const { applyDiscountSchema } = require('../validations/cart.schema')
const checkoutController = require('../controllers/checkout.controller')


router.get('/vnpay/callback', asyncHandler(checkoutController.callbackVnPay))
router.get('/momo/callback', asyncHandler(checkoutController.callbackMomo))
router.use(authentication)

router.post('/apply-discount', validate(applyDiscountSchema), asyncHandler(checkoutController.applyDiscount))
router.post('/remove-discount/:cartId', asyncHandler(checkoutController.cancelCheckout))
router.post('/', asyncHandler(checkoutController.checkout))

module.exports = router