const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const cartController = require('../controllers/cart.controller')
const { addToCartSchema, updateCartSchema } = require('../validations/cart.schema')
const { grantAccess } = require('../middlewares/rbac')

router.use(authentication)

router.get('/', grantAccess('readOwn', 'cart'), asyncHandler(cartController.getCartInfo))
router.post('/', grantAccess('createOwn', 'cart'), validate(addToCartSchema), asyncHandler(cartController.addToCart))
router.post('/update', grantAccess('updateOwn', 'cart'), validate(updateCartSchema), asyncHandler(cartController.updateCart))
router.delete('/item', grantAccess('deleteOwn', 'cart'), asyncHandler(cartController.removeCartItem))
router.delete('/:cartId', grantAccess('deleteOwn', 'cart'), asyncHandler(cartController.deleteCart))

module.exports = router