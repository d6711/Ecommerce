const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const cartController = require('../controllers/cart.controller')
const { addToCartSchema, updateCartSchema, applyDiscountSchema } = require('../validations/cart.schema')

router.use(authentication)

router.get('/', asyncHandler(cartController.getCartInfo))
router.post('/', validate(addToCartSchema), asyncHandler(cartController.addToCart))
router.post('/update', validate(updateCartSchema), asyncHandler(cartController.updateCart))
router.post('/apply-discount', validate(applyDiscountSchema), asyncHandler(cartController.applyDiscountToCart))
// router.post('/checkout/stripe', asyncHandler(cartController.checkoutCart))
router.post('/remove-discount/:cartId', asyncHandler(cartController.removeDiscount))
router.delete('/item', asyncHandler(cartController.removeCartItem))
router.delete('/:cartId', asyncHandler(cartController.deleteCart))





module.exports = router