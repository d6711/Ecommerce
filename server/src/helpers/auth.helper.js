const JWT = require('jsonwebtoken')
const { env } = require('../configs/constants')
const { BadRequestException } = require('../core/error.exception')

function createTokenPair(payload) {
    try {
        const accessToken = JWT.sign(payload, env.ACCESS_TOKEN,
            { expiresIn: '1d' }
        )
        const refreshToken = JWT.sign(payload, env.REFRESH_TOKEN,
            { expiresIn: '10d' }
        )
        return { accessToken, refreshToken }
    } catch (error) {
        throw new BadRequestException('Failed to create token pair')
    }
}

module.exports = {
    createTokenPair
}