const authController = require('../controllers/auth.controller')
const { authentication } = require('../middlewares/auth')
const { asyncHandler, validate } = require('../middlewares/handleError')
const { verifyEmailSchema, registerUserSchema, loginUserSchema, resetPasswordSchema, forgotPasswordSchema, changePasswordSchema } = require('../validations/user.schema')
const { Router } = require('express')
const router = Router()

// otp
router.post('/user/register', validate(registerUserSchema), asyncHandler(authController.register))
router.post('/user/verify-otp', validate(verifyEmailSchema), asyncHandler(authController.verifyEmailOtp))

router.post('/user/forgot-password-otp', validate(forgotPasswordSchema), asyncHandler(authController.forgotPasswordV2))
router.post('/user/reset-password-otp', validate(resetPasswordSchema), asyncHandler(authController.resetPasswordByOtp))

// link
router.post('/user/registerV2', validate(registerUserSchema), asyncHandler(authController.registerV2))
router.get('/user/verify-link', asyncHandler(authController.verifyEmailLink))

router.post('/user/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword))
router.post('/user/reset-password/:resetToken', asyncHandler(authController.resetPasswordByLink))

// auth
router.post('/user/login', validate(loginUserSchema), asyncHandler(authController.login))

router.use(authentication)

router.post('/user/logout', asyncHandler(authController.logout))
router.get('/user/me', asyncHandler(authController.getInfo))
router.post('/refresh-token', asyncHandler(authController.refreshToken))
router.post('/user/change-password', validate(changePasswordSchema), asyncHandler(authController.changePassword))

module.exports = router