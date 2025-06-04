const { env } = require('../configs/constants')
const Success = require('../core/success.response')
const AuthService = require('../services/auth.service')

class AuthController {
    async signUp(req, res) {
        new Success({
            message: 'Check otp code sended to your email',
            metadata: await AuthService.signUp(req.body)
        }).send(res)
    }
    async verifyEmail(req, res) {
        new Success({
            message: 'Verify Success, please login now',
            metadata: await AuthService.verifyEmailOtp(req.body)
        }).send(res)
    }
    async login(req, res) {
        new Success({
            message: 'Login success',
            metadata: await AuthService.login(req.body)
        }).send(res)
    }
    async getMe(req, res) {
        new Success({
            message: 'Get info success',
            metadata: await AuthService.getMe(req.user.userId)
        }).send(res)
    }
    async forgotPassword(req, res) {
        new Success({
            message: 'Check new password in your email',
            metadata: await AuthService.forgotPassword(req.body)
        }).send(res)
    }
    async handleRefreshToken(req, res) {
        new Success({
            message: 'Refresh token success',
            metadata: await AuthService.handleRefreshToken(req.user, req.refreshToken)
        }).send(res)
    }
    async logout(req, res) {
        new Success({
            message: 'Logout success',
            metadata: await AuthService.logout(req.user.userId)
        }).send(res)
    }
    async resetPassword(req, res) {
        new Success({
            message: 'Resetpass word success',
            metadata: await AuthService.resetPassword({
                email: req.user.email,
                ...req.body
            })
        }).send(res)
    }

}

module.exports = new AuthController()