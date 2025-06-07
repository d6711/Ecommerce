const { Status, env } = require("@config/constants");
const { BadRequest, Unauthorized, Forbidden } = require("@core/error.exception");
const { generateRSAKeyPair, createTokenPair } = require("@helpers/auth.helper");
const OTP = require("@models/otp.model");
const User = require("@models/user.model");
const EmailService = require("@services/email.service");
const KeyTokenService = require("@services/keyToken.service");
const { getInfoData } = require("@utils/index");
const { templateVerifyOtp, templateVeryfyLink } = require("@utils/templateEmail");
const bcrypt = require('bcrypt')
const crypto = require('crypto')

class UserService {
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
        EmailService.sendMailVerify({
            toEmail: email,
            subject: 'Verify Email',
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
        if (!isMatch) throw new BadRequest('Invalid password')

        const { publicKey, privateKey } = generateRSAKeyPair()
        const { accessToken, refreshToken } = createTokenPair({ userId: user._id, email }, privateKey)

        await KeyTokenService.createKeyToken({ userId: user._id, refreshToken, publicKey, privateKey })
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

        const foundUser = await User.findOne({ email }).lean()
        if (!foundUser) throw new Unauthorized('The user is not registered')

        const keyToken = await KeyTokenService.findKeyTokenByRefreshToken({ userId, refreshToken })
        if (!keyToken) throw new BadRequest('Key token not found')

        if (keyToken.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyTokenByUserId(userId)
            throw new Forbidden('Please login again')
        }

        const { accessToken, refreshToken: newRefreshToken } = createTokenPair(
            { userId, email },
            keyToken.privateKey
        )
        await KeyTokenService.updateKeyToken({ refreshToken, newRefreshToken, userId })
        return {
            accessToken,
            refreshToken: newRefreshToken
        }
    }
    static logout = async (userId) => {
        return await KeyTokenService.deleteKeyTokenByUserId(userId)
    }
    static forgotPassword = async ({ email }) => {
        const user = await User.findOne({ email }).lean()
        if (!user) throw new BadRequest('User not found')

        const otpCode = Math.floor(100000 + Math.random() * 900000)
        await User.updateOne(
            { _id: user._id },
            { otpCode, otpExpires: Date.now() + 60 * 10 * 1000 }
        )
        EmailService.sendMailVerify({
            toEmail: email,
            subject: 'Forgot Password',
            html: templateVerifyOtp(user.name, otpCode)
        })
        return
    }
    static verifyForgotPasswordByOtp = async ({ email, otp, newPassword }) => {
        const user = await User.findOne({ email }).lean()
        if (!user) throw new BadRequest('User not found')

        if (user.otpCode !== otp) throw new BadRequest('OTP not valid')
        if (user.otpExpires < Date.now()) throw new BadRequest('OTP expired, please verify again')
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.updateOne({ _id: user._id }, {
            password: hashedPassword,
            otpCode: null,
            otpExpires: null
        })
        return
    }
    static resetPassword = async ({ email, oldPassword, newPassword, cfmPassword }) => {
        const user = await User.findOne({ email }).lean()
        if (!user) throw new BadRequest('User not found')

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) throw new BadRequest('Password not match')

        if (newPassword !== cfmPassword) throw new BadRequest('New password not match')

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.updateOne({ _id: user._id }, {
            password: hashedPassword
        })
        return
    }
    static signUpV2 = async ({ email, name, password }) => {
        let user = await User.findOne({ email })
        if (user) throw new BadRequest('User already exists')

        const token = crypto.randomBytes(32).toString('hex')
        const tokenHashed = await bcrypt.hash(token, 10)
        const passwordHashed = await bcrypt.hash(password, 10)
        const verifyLink = `http://${env.URL_SERVER}/v1/api/user/verify?email=${email}&token=${token}`;

        const newOtp = new OTP({
            email,
            token: tokenHashed
        })
        await newOtp.save()

        user = new User({
            email, name,
            password: passwordHashed,
        })
        await user.save()

        EmailService.sendMailVerify({
            toEmail: email,
            subject: 'Verify Email',
            html: templateVeryfyLink(name, verifyLink)
        })
        return
    }
    static async verifyEmailByLink({ email, token }) {
        const otp = await OTP.findOne({ email })
        if (!otp) throw new BadRequest('Token expired, please sign up again')

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

}

module.exports = UserService