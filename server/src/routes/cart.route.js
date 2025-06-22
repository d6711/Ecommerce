const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const cartController = require('../controllers/cart.controller')
const { addToCartSchema, updateCartSchema } = require('../validations/cart.schema')

router.use(authentication)

router.get('/', asyncHandler(cartController.getCartInfo))
router.post('/', validate(addToCartSchema), asyncHandler(cartController.addToCart))
router.post('/update', validate(updateCartSchema), asyncHandler(cartController.updateCart))
router.delete('/item', asyncHandler(cartController.removeCartItem))
router.delete('/:cartId', asyncHandler(cartController.deleteCart))

module.exports = router