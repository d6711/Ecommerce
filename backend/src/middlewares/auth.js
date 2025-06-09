const { Headers } = require("@config/constants");
const { Unauthorized } = require("@core/error.exception");
const { verifyToken } = require("@helpers/auth.helper");
const { asyncHandler } = require("@middlewares/handleError");
const KeyTokenService = require("@services/keyToken.service");

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[Headers.CLIENT_ID]
    if (!userId) throw new Unauthorized('Missing Client ID')

    const keyToken = await KeyTokenService.findKeyTokenByUserId(userId)
    if (!keyToken) throw new Unauthorized('Please login')

    const authHeader = req.headers[Headers.AUTHORIZATION]
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(" ")[1] : authHeader
    const refreshToken = req.headers[Headers.REFRESH_TOKEN]

    if (!accessToken && !refreshToken) throw new Unauthorized('Not Authorized')

    if (refreshToken) {
        const decoded = verifyToken(refreshToken, keyToken.publicKey)
        if (decoded.userId !== userId) throw new Unauthorized('Invalid user')

        req.user = decoded
        req.refreshToken = refreshToken
        return next()
    }
    if (accessToken) {
        const decoded = verifyToken(accessToken, keyToken.publicKey)
        if (decoded.userId !== userId) throw new Unauthorized('Invalid user')

        req.user = decoded
        return next()
    }
})

module.exports = {
    authentication
}