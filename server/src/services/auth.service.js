const { Status, env, VerifyType } = require("../config/constants")
const { BadRequest, Unauthorized, Forbidden } = require("../core/error.exception")
const { createTokenPair } = require("../helpers/auth.helper")
const OTP = require("../models/otp.model")
const User = require("../models/user.model")
const EmailService = require("./email.service")
const KeyTokenService = require("./keyToken.service")
const { getInfoData } = require("../utils/index")
const { templateVerifyOtp, templateVerifyLink } = require("../utils/templateEmail")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

class AuthService {
    static async signUp({ email, name, password }) {
        let user = await User.findOne({ email })
        if (user) throw new BadRequest('User already exists')

        const otpCode = Math.floor(100000 + Math.random() * 900000)
        const passwordHashed = await bcrypt.hash(password, 10)

        user = new User({
            email, name,
            password: passwordHashed,
            otpCode,
            otpExpires: Date.now() + 10 * 60 * 1000
        })
        await user.save()
        EmailService.sendMail({
            toEmail: email,
            subject: 'Chào mừng bạn đến với XStore - Vui lòng xác minh email',
            html: templateVerifyOtp(name, otpCode)
        })
        return
    }
    static async verifyEmailByOTP({ email, otp }) {
        let user = await User.findOne({ email })
        if (!user) throw new BadRequest('Invalid email')

        if (user.otpCode !== otp) throw new BadRequest('Invalid OTP')
        if (Date.now() > user.otpExpires) {
            await User.deleteOne({ email })
            throw new BadRequest('OTP expired, please sign up again')
        }

        user.otpCode = null
        user.otpExpires = null
        user.verify = true
        await user.save()
        return
    }
    static async login({ email, password }) {
        const user = await User.findOne({ email })
        if (!user) throw new BadRequest('User not registered')
        if (user.status === Status.BANNED) throw new BadRequest('Your account is banned')

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new Unauthorized('Invalid password')

        const userId = user._id
        const { accessToken, refreshToken } = createTokenPair({ userId, email })
        await KeyTokenService.createKeyToken({ userId, refreshToken })
        return {
            userInfo: getInfoData({
                fields: ['_id', 'name', 'email', 'role'],
                object: user
            }),
            accessToken,
            refreshToken
        }

    }
    static handleRefreshToken = async ({ refreshToken, user }) => {
        const { userId, email } = user

        const foundUser = await User.findOne({ email })
        if (!foundUser) throw new Unauthorized('The user is not registered')

        const keyToken = await KeyTokenService.findKeyTokenByRefreshToken({ userId, refreshToken })
        if (!keyToken) throw new BadRequest('Key token not found')

        if (keyToken.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyTokenByUserId(userId)
            throw new Forbidden('Please login again')
        }

        const { accessToken, refreshToken: newRefreshToken } = createTokenPair({ userId, email })
        await KeyTokenService.updateKeyToken({ refreshToken, newRefreshToken, userId })
        return {
            accessToken,
            refreshToken: newRefreshToken
        }
    }
    static logout = async (userId) => {
        return await KeyTokenService.deleteKeyTokenByUserId(userId)
    }
    static forgotPasswordV2 = async ({ email }) => {
        const user = await User.findOne({ email })
        if (!user) throw new BadRequest('User not found')

        const otpCode = Math.floor(100000 + Math.random() * 900000)
        await User.updateOne(
            { _id: user._id },
            { otpCode, otpExpires: Date.now() + 60 * 10 * 1000 }
        )
        EmailService.sendMail({
            toEmail: email,
            subject: 'OTP xác minh mật khẩu mới',
            html: templateVerifyOtp(user.name, otpCode)
        })
        return
    }
    static resetPasswordByOtp = async ({ email, otp, newPassword }) => {
        const user = await User.findOne({ email })
        if (!user) throw new BadRequest('User not found')

        if (user.otpCode !== otp) throw new BadRequest('OTP not valid')
        if (user.otpExpires < Date.now()) throw new BadRequest('OTP expired, please verify again')
        const passwordHashed = await bcrypt.hash(newPassword, 10)
        await User.updateOne({ _id: user._id }, {
            password: passwordHashed,
            otpCode: null,
            otpExpires: null
        })
        return
    }
    static changePassword = async ({ email, currentPassword, newPassword }) => {
        const user = await User.findOne({ email })
        if (!user) throw new BadRequest('User not found')

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) throw new BadRequest('Password not match')

        const passwordHashed = await bcrypt.hash(newPassword, 10)
        await User.updateOne({ _id: user._id }, { password: passwordHashed })
        return
    }
    static signUpV2 = async ({ email, name, password }) => {
        let user = await User.findOne({ email })
        if (user) throw new BadRequest('User already exists')

        const token = crypto.randomBytes(32).toString('hex')
        const tokenHashed = await bcrypt.hash(token, 10)
        const passwordHashed = await bcrypt.hash(password, 10)
        const verifyLink = `http://${env.URL_SERVER}/v1/api/auth/user/verify-link?email=${email}&token=${token}`

        const newOtp = new OTP({
            email,
            token: tokenHashed,
            type: VerifyType.EMAIL
        })
        await newOtp.save()

        user = new User({
            email, name,
            password: passwordHashed,
        })
        await user.save()

        EmailService.sendMail({
            toEmail: email,
            subject: 'Chào mừng bạn đến với XStore - Vui lòng xác minh email',
            html: templateVerifyLink(name, verifyLink)
        })
        return
    }
    static async verifyEmailByLink({ email, token }) {
        const otp = await OTP.findOne({ email })
        if (!otp) throw new BadRequest('Token expired, please sign up again')
        if (otp.type !== VerifyType.EMAIL) throw new BadRequest('Invalid token')

        const user = await User.findOne({ email })
        if (!user) throw new BadRequest('Invalid email')
        if (user.verify === true) throw BadRequest('Verified email')

        const isMatch = await bcrypt.compare(token, otp.token)
        if (!isMatch) throw new BadRequest('Invalid token email')

        user.verify = true
        await OTP.deleteOne({ email })
        await user.save()
        return
    }
    static async forgotPassword({ email }) {
        const user = await User.findOne({ email })
        if (!user) throw new BadRequest('User not registered')

        const resetToken = crypto.randomBytes(32).toString('hex')
        const tokenHashed = crypto.createHash('sha256').update(resetToken).digest('hex')
        await OTP.findOneAndUpdate(
            { email, type: VerifyType.RESET_PASSWORD },
            { token: tokenHashed },
            { new: true, upsert: true }
        )
        const verifyLink = `http://${env.URL_SERVER}/v1/api/auth/user/reset-password/${resetToken}`

        EmailService.sendMail({
            toEmail: email,
            subject: 'Reset your password',
            html: `<p>Click here to reset your password: <a href="${verifyLink}">${verifyLink}</a></p>`
        })
        return { verifyLink }
    }
    static async resetPasswordByLink({ resetToken, newPassword }) {
        const tokenHashed = crypto.createHash('sha256').update(resetToken).digest('hex')
        const otp = await OTP.findOne({
            token: tokenHashed,
            type: VerifyType.RESET_PASSWORD,
        })
        if (!otp) throw new BadRequest('Invalid or expired token')
        const user = await User.findOne({ email: otp.email })
        if (!user) throw new BadRequest('User not found')

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        await OTP.deleteOne({ _id: otp._id })
        return
    }
    static async getMe(userId) {
        return await User.findById(userId)
    }
}

module.exports = AuthService