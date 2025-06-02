const JWT = require('jsonwebtoken')
const { Headers, env } = require('../configs/constants')
const { UnauthorizedException, BadRequestException } = require('../core/error.exception')
const { User } = require('../models/user.model')

async function authentication(req, res, next) {
    let accessToken = req.headers[Headers.AUTHORIZATION]
    accessToken = accessToken.startsWith('Bearer ') ? accessToken.split(" ")[1] : accessToken

    const refreshToken = req.headers[Headers.REFRESH_TOKEN]
    if (!accessToken && !refreshToken) throw new UnauthorizedException('Please login')

    if (accessToken) {
        try {
            const decodeUser = JWT.verify(accessToken, env.ACCESS_TOKEN)
            if (!decodeUser.userId) throw new UnauthorizedException('Invalid token')

            const user = await User.findById(decodeUser.userId)
            if (!user) throw new UnauthorizedException('Invalid account')

            req.user = decodeUser
        } catch (error) {
            throw new UnauthorizedException('Failed to verify:', error.message)
        }
    }
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, env.REFRESH_TOKEN)
            if (!decodeUser.userId) throw new UnauthorizedException('Invalid token')

            const user = await User.findById(decodeUser.userId)
            if (!user) throw new UnauthorizedException('Invalid account')

            req.user = decodeUser
            req.refreshToken = refreshToken
        } catch (error) {
            throw new UnauthorizedException('Failed to verify:', error.message)
        }
    }
    next()
}

module.exports = { authentication }