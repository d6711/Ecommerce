const userController = require('@controllers/user.controller')
const { authentication } = require('@middlewares/auth')
const { asyncHandler, validate } = require('@middlewares/handleError')
const { verifyEmailSchema, registerUserSchema, loginUserSchema, resetPasswordSchema, forgotPasswordSchema, changePasswordSchema } = require('@validations/user.schema')
const { Router } = require('express')
const router = Router()

// otp
router.post('/register', validate(registerUserSchema), asyncHandler(userController.register))
router.post('/verify-otp', validate(verifyEmailSchema), asyncHandler(userController.verifyEmailOtp))

router.post('/forgot-password-otp', validate(forgotPasswordSchema), asyncHandler(userController.forgotPasswordV2))
router.post('/reset-password-otp', validate(resetPasswordSchema), asyncHandler(userController.resetPasswordByOtp))

// link
router.post('/registerV2', validate(registerUserSchema), asyncHandler(userController.registerV2))
router.get('/verify-link', asyncHandler(userController.verifyEmailLink))

router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(userController.forgotPassword))
router.post('/reset-password/:resetToken', asyncHandler(userController.resetPasswordByLink))

// auth
router.post('/login', validate(loginUserSchema), asyncHandler(userController.login))

router.use(authentication)

router.post('/logout', asyncHandler(userController.logout))
router.post('/refresh-token', asyncHandler(userController.refreshToken))
router.post('/change-password', validate(changePasswordSchema), asyncHandler(userController.changePassword))



module.exports = router