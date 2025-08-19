const JWT = require('jsonwebtoken')
const { Unauthorized, BadRequest } = require('../core/error.exception')
const { env } = require('../config/constants')
const User = require('../models/user.model')

function signToken({ payload, secretKey, expiresIn = '1h' }) {
    try {
        return JWT.sign(payload, secretKey, {
            expiresIn
        })
    } catch (error) {
        throw new Unauthorized(`Failed to sign token: ${error.message}`)
    }
}

function verifyToken(token, secretKey) {
    try {
        return JWT.verify(token, secretKey)
    } catch (error) {
        throw new Unauthorized(`Failed to verify token: ${error.message}`)
    }
}

function createTokenPair(payload) {
    try {
        const accessToken = signToken({ payload, secretKey: env.ACCESS_TOKEN })
        const refreshToken = signToken({
            payload,
            secretKey: env.REFRESH_TOKEN,
            expiresIn: '7d'
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new BadRequest(`Failed to create token pair: ${error.message}`)
    }
}

async function getUserById(id) {
    return await User.findById(id)
}

module.exports = {
    signToken,
    verifyToken,
    createTokenPair,
    getUserById
}