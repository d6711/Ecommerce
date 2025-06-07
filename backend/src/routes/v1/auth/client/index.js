const userController = require('@controllers/user.controller')
const { asyncHandler } = require('@middlewares/handleError')
const { Router } = require('express')
const router = Router()

router.post('/register', asyncHandler(userController.register))
router.post('/registerV2', asyncHandler(userController.registerV2))

module.exports = router