const { Success } = require("@core/success.response")
const UserService = require("@services/user.service")

class UserController {
    async register(req, res) {
        new Success({
            message: 'Check OTP code sent to your email',
            metadata: await UserService.signUp(req.body)
        }).send(res)
    }
    async verifyEmailOtp(req, res) {
        new Success({
            message: 'Verified success, you can login now',
            metadata: await UserService.verifyEmailByOTP(req.body)
        }).send(res)
    }
    async registerV2(req, res) {
        new Success({
            message: 'Check verify link sent to your email',
            metadata: await UserService.signUpV2(req.body)
        }).send(res)
    }
    async verifyEmailLink(req, res) {
        new Success({
            message: 'Verified success, you can login now',
            metadata: await UserService.verifyEmailByLink(req.query)
        }).send(res)
    }
    async login(req, res) {
        new Success({
            message: 'Login successfully',
            metadata: await UserService.login(req.body)
        }).send(res)
    }
    async logout(req, res) {
        new Success({
            message: 'Logout successfully',
            metadata: await UserService.logout(req.user.userId)
        }).send(res)
    }
    async refreshToken(req, res) {
        new Success({
            message: 'Refresh token successfully',
            metadata: await UserService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user
            })
        }).send(res)
    }
    async forgotPassword(req, res) {
        new Success({
            message: 'Check verify link sent to your email',
            metadata: await UserService.forgotPassword(req.body)
        }).send(res)
    }
    async resetPasswordByLink(req, res) {
        new Success({
            message: 'Reset password success, you can login now',
            metadata: await UserService.resetPasswordByLink({
                resetToken: req.params.resetToken,
                newPassword: req.body.newPassword
            })
        }).send(res)
    }
    async forgotPasswordV2(req, res) {
        new Success({
            message: 'Check verify code sent to your email',
            metadata: await UserService.forgotPasswordV2(req.body)
        }).send(res)
    }
    async resetPasswordByOtp(req, res) {
        new Success({
            message: 'Reset password success, you can login now',
            metadata: await UserService.resetPasswordByOtp(req.body)
        }).send(res)
    }
    async changePassword(req, res) {
        new Success({
            message: 'Reset password success, you can login now',
            metadata: await UserService.changePassword({
                email: req.user.email,
                ...req.body
            })
        }).send(res)
    }
    async getInfo(req, res) {
        new Success({
            message: 'Get me successfully',
            metadata: await UserService.getMe(req.user.userId)
        }).send(res)
    }
}

module.exports = new UserController()