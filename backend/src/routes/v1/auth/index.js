const userController = require('@controllers/user.controller')
const { authentication } = require('@middlewares/auth')
const { asyncHandler, validate } = require('@middlewares/handleError')
const { verifyEmailSchema, registerUserSchema, loginUserSchema, resetPasswordSchema, forgotPasswordSchema, changePasswordSchema } = require('@validations/user.schema')
const { Router } = require('express')
const router = Router()

// otp
router.post('/user/register', validate(registerUserSchema), asyncHandler(userController.register))
router.post('/user/verify-otp', validate(verifyEmailSchema), asyncHandler(userController.verifyEmailOtp))

router.post('/user/forgot-password-otp', validate(forgotPasswordSchema), asyncHandler(userController.forgotPasswordV2))
router.post('/user/reset-password-otp', validate(resetPasswordSchema), asyncHandler(userController.resetPasswordByOtp))

// link
router.post('/user/registerV2', validate(registerUserSchema), asyncHandler(userController.registerV2))
router.get('/user/verify-link', asyncHandler(userController.verifyEmailLink))

router.post('/user/forgot-password', validate(forgotPasswordSchema), asyncHandler(userController.forgotPassword))
router.post('/user/reset-password/:resetToken', asyncHandler(userController.resetPasswordByLink))

// auth
router.post('/user/login', validate(loginUserSchema), asyncHandler(userController.login))

router.use(authentication)

router.post('/user/logout', asyncHandler(userController.logout))
router.get('/user/me', asyncHandler(userController.getInfo))
router.post('/refresh-token', asyncHandler(userController.refreshToken))
router.post('/user/change-password', validate(changePasswordSchema), asyncHandler(userController.changePassword))



module.exports = router