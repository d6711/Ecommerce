const { User } = require('../models/user.model')
const { BadRequestException } = require('../core/error.exception')
const bcrypt = require('bcrypt')
class AuthService {
    static async signUp({ email, name, password }) {
        let user = await User.findOne({ email })
        if (user) throw new BadRequestException('User already exists')

        const verifyCode = Math.floor(100000 + Math.random() * 900000)
        const passwordHashed = await bcrypt.hash(password, 10)

        user = new User({
            email,
            password: passwordHashed,
            otpCode: verifyCode,
            otpExpires: new Date(Date.now() + 60 * 1000 * 10),
        })
        await user.save()
        return
    }
    static async verifyEmailOtp() { }
    static async login() { }
    static async logout() { }
    static async handleRefreshToken() { }
    static async forgotPassword() { }
    static async verifyPasswordOtp() { }
    static async resetPassword() { }
}

module.exports = AuthService