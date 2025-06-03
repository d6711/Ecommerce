const { Router } = require('express')
const { asyncHandler, validate } = require('../../middlewares/handleError')
const { registerUserSchema, loginUserSchema, verifyEmailSchema, resetPasswordSchema } = require('../../validators/user.schema')
const authController = require('../../controllers/auth.controller')
const { authentication } = require('../../middlewares/auth')
const router = Router()

router.post('/register', validate(registerUserSchema), asyncHandler(authController.signUp))
router.post('/verify', validate(verifyEmailSchema), asyncHandler(authController.verifyEmail))
router.post('/login', validate(loginUserSchema), asyncHandler(authController.login))
router.post('/password/forgot', asyncHandler(authController.forgotPassword))

router.use(authentication)

router.post('/password/reset', validate(resetPasswordSchema), asyncHandler(authController.resetPassword))
router.post('/logout', asyncHandler(authController.logout))
router.post('/refresh-token', asyncHandler(authController.handleRefreshToken))
router.get('/me', asyncHandler(authController.getMe))

module.exports = router