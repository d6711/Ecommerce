const { Router } = require('express')
const router = Router()
const { asyncHandler, validate } = require('../middlewares/handleError')
const { authentication } = require('../middlewares/auth')
const orderController = require('../controllers/order.controller')
const { grantAccess } = require('../middlewares/rbac')

router.use(authentication)

router.get('/my-order', grantAccess('readOwn', 'order'), asyncHandler(orderController.getMyOrder))
router.get('/', grantAccess('readAny', 'order'), asyncHandler(orderController.getOrders))

module.exports = router