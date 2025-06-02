const { User } = require('../models/user.model')
const { BadRequestException, UnauthorizedException } = require('../core/error.exception')
const bcrypt = require('bcrypt')
const EmailService = require('./email.service')
const { templateEmailVerify, templateResetPassword } = require('../utils/templateEmail')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../helpers/auth.helper')
const crypto = require('crypto')

class AuthService {
    static async signUp({ email, name, password }) {
        let user = await User.findOne({ email })
        if (user) throw new BadRequestException('User already exists')

        const verifyCode = Math.floor(100000 + Math.random() * 900000)
        const passwordHashed = await bcrypt.hash(password, 10)

        user = new User({
            email, name,
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
        if (Date.now() > user.otpExpires) {
            await User.deleteOne({ email })
            throw new BadRequestException('OTP expired, please register again')
        }

        user.otpCode = null
        user.otpExpires = null
        user.verify = true
        await user.save()
        return
    }
    static async login({ email, name, password }) {
        const user = await User.findOne({ email })
        if (!user) throw new BadRequestException('User not registered')

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new BadRequestException('Invalid password')

        const payload = {
            userId: user._id,
            email: user.email
        }

        const { accessToken, refreshToken } = createTokenPair(payload)
        await KeyTokenService.createKeyToken(payload.userId, refreshToken)

        payload.name = user.name
        payload.role = user.role
        return {
            payload,
            accessToken,
            refreshToken
        }
    }
    static async logout(userId) {
        return await KeyTokenService.deleteKeyToken(userId)
    }
    static async handleRefreshToken(user, refreshToken) {
        console.log(user)
        const { userId, email } = user
        console.log(refreshToken)

        const foundUser = await User.findById(userId)
        if (!foundUser) throw new BadRequestException('Invalid user')

        const keyToken = await KeyTokenService.findKeyTokenByRefreshToken(userId, refreshToken)
        if (!keyToken) throw new BadRequestException('Invalid token')

        if (keyToken.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyToken(userId)
            throw new UnauthorizedException('Please you login again')
        }

        const { accessToken, refreshToken: newRefreshToken } = createTokenPair({ userId, email })
        await KeyTokenService.updateKeyToken(userId, refreshToken, newRefreshToken)

        return { accessToken, refreshToken: newRefreshToken }
    }
    static async forgotPassword({ email }) {
        if (!email) throw new BadRequestException('You logged')

        let user = await User.findOne({ email })
        if (!user) throw new BadRequestException('User not registered')

        const newPassword = crypto.randomBytes(5).toString('hex')
        user.password = await bcrypt.hash(newPassword, 10)
        user.save()

        EmailService.sendMailOtp({
            toEmail: email,
            subject: 'Forgot password',
            html: templateResetPassword(user.name, newPassword)
        })
        return
    }
    static async resetPassword({ email, oldPassword, newPassword }) {
        let user = await User.findOne({ email })
        if (!user) throw new BadRequestException('User not registered')

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) throw new BadRequestException('Invalid password')

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        return
    }
}

module.exports = AuthService