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


}

module.exports = new UserController()