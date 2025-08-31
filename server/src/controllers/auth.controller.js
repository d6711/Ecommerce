const { Success } = require("../core/success.response")
const AuthService = require("../services/auth.service")

class AuthController {
    async register(req, res) {
        new Success({
            message: 'Check OTP code sent to your email',
            metadata: await AuthService.signUp(req.body)
        }).send(res)
    }
    async verifyEmailOtp(req, res) {
        new Success({
            message: 'Verified success, you can login now',
            metadata: await AuthService.verifyEmailByOTP(req.body)
        }).send(res)
    }
    async signUpByLink(req, res) {
        new Success({
            message: 'Check verify link sent to your email',
            metadata: await AuthService.signUpByLink(req.body)
        }).send(res)
    }
    async verifyEmailLink(req, res) {
        new Success({
            message: 'Verified success, you can login now',
            metadata: await AuthService.verifyEmailByLink(req.query)
        }).send(res)
    }
    async login(req, res) {
        new Success({
            message: 'Login successfully',
            metadata: await AuthService.login(req.body)
        }).send(res)
    }
    async logout(req, res) {
        new Success({
            message: 'Logout successfully',
            metadata: await AuthService.logout(req.user.userId)
        }).send(res)
    }
    async refreshToken(req, res) {
        new Success({
            message: 'Refresh token successfully',
            metadata: await AuthService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user
            })
        }).send(res)
    }
    async forgotPasswordByLink(req, res) {
        new Success({
            message: 'Check verify link sent to your email',
            metadata: await AuthService.forgotPasswordByLink(req.body)
        }).send(res)
    }
    async resetPasswordByLink(req, res) {
        new Success({
            message: 'Reset password success, you can login now',
            metadata: await AuthService.resetPasswordByLink({
                resetToken: req.params.resetToken,
                newPassword: req.body.newPassword
            })
        }).send(res)
    }
    async forgotPasswordByOTP(req, res) {
        new Success({
            message: 'Check verify code sent to your email',
            metadata: await AuthService.forgotPasswordByOTP(req.body)
        }).send(res)
    }
    async resetPasswordByOtp(req, res) {
        new Success({
            message: 'Reset password success, you can login now',
            metadata: await AuthService.resetPasswordByOtp(req.body)
        }).send(res)
    }
    async changePassword(req, res) {
        new Success({
            message: 'Change password successfully',
            metadata: await AuthService.changePassword({
                email: req.user.email,
                ...req.body
            })
        }).send(res)
    }
    async getInfo(req, res) {
        new Success({
            message: 'Get me successfully',
            metadata: await AuthService.getMe(req.user.userId)
        }).send(res)
    }
    async getAllCustomers(req, res) {
        const { data, page, limit, totalDocuments, totalPages } = await AuthService.getAllCustomers(req.query)
        new Success({
            message: 'Get all customers successfully',
            pagination: {
                page,
                limit,
                totalDocuments,
                totalPages
            },
            metadata: data
        }).send(res)
    }
}

module.exports = new AuthController()