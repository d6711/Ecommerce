const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const orderController = require('../controllers/order.controller')

router.use(authentication)

router.get('/my-order', asyncHandler(orderController.getMyOrder))
router.get('/', asyncHandler(orderController.getOrders))

module.exports = router