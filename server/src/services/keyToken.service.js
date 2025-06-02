const { KeyToken } = require('../models/keyToken.model')
const { BadRequestException } = require('../core/error.exception')


class KeyTokenService {
    static async createKeyToken(userId, refreshToken) {
        const keyToken = await KeyToken.findOneAndUpdate(
            { user: userId },
            { refreshToken: refreshToken },
            { new: true, upsert: true }
        )
        if (!keyToken) throw new BadRequestException('Failed to create key token')
        return keyToken
    }
    static async findKeyTokenByRefreshToken(userId, refreshToken) {
        return await KeyToken.findOne({
            user: userId,
            $or: [
                { refreshToken: refreshToken },
                { refreshTokenUsed: refreshToken },
            ]
        })
    }
    static async deleteKeyToken(userId) {
        const keyToken = await KeyToken.findOne({ user: userId })
        if (!keyToken) throw new BadRequestException('Please login')
        return await KeyToken.deleteOne({ user: userId })
    }
    static async updateKeyToken(userId, refreshToken, newRefreshToken) {
        const updated = await KeyToken.findOneAndUpdate(
            { user: userId },
            {
                refreshToken: newRefreshToken,
                refreshTokenUsed: refreshToken
            },
            { new: true }
        )
        if (!updated) throw new BadRequestException('Failed to update keytoken')
        return
    }
}

module.exports = KeyTokenService