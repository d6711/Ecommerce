const { BadRequest } = require("@core/error.exception")
const KeyToken = require("@models/keyToken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        const keyToken = await KeyToken.findOneAndUpdate({ user: userId },
            {
                publicKey,
                privateKey,
                refreshToken,
                refreshTokenUsed: []
            },
            { new: true, upsert: true })
        if (!keyToken) throw new BadRequest('Failed to create key token')
        return keyToken
    }
    static deleteKeyTokenByUserId = async (userId) => {
        const keyToken = await KeyToken.findOne({ user: userId }).lean()
        if (!keyToken) throw new BadRequest('Key token not found')
        return await KeyToken.deleteOne({ user: userId })
    }
    static updateKeyToken = async ({ refreshToken, newRefreshToken, userId }) => {
        const updated = await KeyToken.findOneAndUpdate(
            { user: userId },
            {
                $set: { refreshToken: newRefreshToken },
                $addToSet: { refreshTokenUsed: refreshToken }
            }, { new: true }
        )
        if (!updated) throw new BadRequest('Key token not updated')
        return updated
    }
    static findKeyTokenByUserId = async (userId) => {
        return await KeyToken.findOne({ user: userId }).lean()
    }
    static findKeyTokenByRefreshToken = async ({ userId, refreshToken }) => {
        return await KeyToken.findOne({
            user: userId,
            $or: [
                { refreshToken: refreshToken },
                { refreshTokenUsed: refreshToken }
            ]
        }).lean()
    }

}

module.exports = KeyTokenService