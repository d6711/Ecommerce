const { Headers, env } = require("../config/constants")
const { Unauthorized } = require("../core/error.exception")
const { verifyToken, getUserById } = require("../helpers/auth.helper")

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers[Headers.AUTHORIZATION]
        const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(" ")[1] : authHeader

        const refreshToken = req.headers[Headers.REFRESH_TOKEN]
        if (!accessToken && !refreshToken) throw new Unauthorized('Please login')
        if (refreshToken) {
            const decoded = verifyToken(refreshToken, env.REFRESH_TOKEN)
            const user = await getUserById(decoded.userId)
            if (!user) throw new Unauthorized('Not Authorized')
            req.user = decoded
            req.refreshToken = refreshToken
        }
        if (accessToken) {
            const decoded = verifyToken(accessToken, env.ACCESS_TOKEN)
            const user = await getUserById(decoded.userId)
            if (!user) throw new Unauthorized('Not Authorized')
            req.user = decoded
        }
        next()
    } catch (error) {
        const jwtErrors = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError']
        if (jwtErrors.includes(error.name)) error.status = 401
        next(error)
    }
}

module.exports = {
    authentication
}