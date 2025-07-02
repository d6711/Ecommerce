const authController = require('../controllers/auth.controller')
const { authentication } = require('../middlewares/auth')
const { asyncHandler, validate } = require('../middlewares/handleError')
const { verifyEmailSchema, registerUserSchema, loginUserSchema, resetPasswordSchema, forgotPasswordSchema, changePasswordSchema } = require('../validations/user.schema')
const { Router } = require('express')
const router = Router()

// router.post('/user/register', validate(registerUserSchema), asyncHandler(authController.register))
// router.post('/user/verify-otp', validate(verifyEmailSchema), asyncHandler(authController.verifyEmailOtp))

// router.post('/user/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPasswordByOTP))
// router.post('/user/reset-password', validate(resetPasswordSchema), asyncHandler(authController.resetPasswordByOtp))

router.post('/user/register', validate(registerUserSchema), asyncHandler(authController.signUpByLink))
router.get('/user/verify-link', asyncHandler(authController.verifyEmailLink))

router.post('/user/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPasswordByLink))
router.post('/user/reset-password/:resetToken', asyncHandler(authController.resetPasswordByLink))

router.post('/user/login', validate(loginUserSchema), asyncHandler(authController.login))

router.use(authentication)

router.get('/user/me', asyncHandler(authController.getInfo))
router.post('/user/logout', asyncHandler(authController.logout))
router.post('/refresh-token', asyncHandler(authController.refreshToken))
router.post('/user/change-password', validate(changePasswordSchema), asyncHandler(authController.changePassword))

module.exports = router