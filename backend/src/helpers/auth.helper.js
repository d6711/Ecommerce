const { BadRequest, Unauthorized } = require('@core/error.exception')
const JWT = require('jsonwebtoken')
const { generateKeyPairSync } = require('crypto')

function signToken({ payload, privateKey, expiresIn = '1m' }) {
    try {
        return JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn
        })
    } catch (error) {
        throw new Unauthorized(`Failed to sign token: ${error.message}`)
    }
}

function verifyToken(token, publicKey) {
    try {
        return JWT.verify(token, publicKey, { algorithms: ['RS256'] })
    } catch (error) {
        throw new Unauthorized(`Failed to verify token: ${error.message}`)
    }
}

function createTokenPair(payload, privateKey) {
    try {
        const accessToken = signToken({ payload, privateKey })
        const refreshToken = signToken({
            payload,
            privateKey,
            expiresIn: '7d'
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new BadRequest(`Failed to create token pair: ${error.message}`)
    }
}

function generateRSAKeyPair() {
    try {
        return generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        })
    } catch (error) {
        throw new BadRequest(`Failed to create RSA key pair: ${error.message}`)
    }
}

module.exports = {
    signToken,
    verifyToken,
    createTokenPair,
    generateRSAKeyPair
}