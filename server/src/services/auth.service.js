const { User } = require('../models/user.model')
const { BadRequestException } = require('../core/error.exception')
const bcrypt = require('bcrypt')
const EmailService = require('./email.service')
const { templateEmailVerify } = require('../utils/templateEmail')

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
            otpExpires: Date.now() + 60 * 1000 * 10,
        })
        await user.save()
        EmailService.sendMailOtp({
            toEmail: email,
            subject: 'Verify Email',
            html: templateEmailVerify(name, verifyCode)
        })
        return
    }
    static async verifyEmailOtp({ email, otp }) {
        let user = await User.findOne({ email })
        if (!user) throw new BadRequestException('User not found')

        if (user.otpCode !== otp) throw new BadRequestException('Invalid OTP')
        if (Date.now() > user.otpExpires) throw new BadRequestException('OTP expired')

        user.otpCode = null
        user.otpExpires = null
        user.verify = true
        await user.save()
        return
    }
    static async login() { }
    static async logout() { }
    static async handleRefreshToken() { }
    static async forgotPassword() { }
    static async verifyPasswordOtp() { }
    static async resetPassword() { }
}

module.exports = AuthService