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
        const { accessToken, refreshToken, payload } = await AuthService.login(req.body)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,    // Không cho JS truy cập
            secure: env.NODE_ENV === 'producttion',
            sameSite: 'strict',  // Bảo vệ khỏi CSRF
            maxAge: 10 * 60 * 1000
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,    // Không cho JS truy cập
            secure: env.NODE_ENV === 'producttion',
            sameSite: 'strict',  // Bảo vệ khỏi CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        new Success({
            message: 'Login success',
            metadata: { userInfo: payload, accessToken, refreshToken }
        }).send(res)
    }
    async forgotPassword(req, res) {
        new Success({
            message: 'Check new password in your email',
            metadata: await AuthService.forgotPassword(req.body)
        }).send(res)
    }
    async handleRefreshToken(req, res) {
        const { accessToken, refreshToken } = await AuthService.handleRefreshToken(req.user, req.refreshToken)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,    // Không cho JS truy cập
            secure: env.NODE_ENV === 'producttion',
            sameSite: 'strict',  // Bảo vệ khỏi CSRF
            maxAge: 10 * 60 * 1000
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,    // Không cho JS truy cập
            secure: env.NODE_ENV === 'producttion',
            sameSite: 'strict',  // Bảo vệ khỏi CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        new Success({
            message: 'Refresh token success',
            metadata: { accessToken, refreshToken }
        }).send(res)
    }
    async logout(req, res) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'strict',
        })
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
        })
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