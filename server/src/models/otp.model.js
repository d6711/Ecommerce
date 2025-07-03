const { VerifyType } = require('../config/constants')
const { Schema, Types, model } = require('mongoose')

const DOCUMENT_NAME = 'Otp'
const COLLECTION_NAME = 'Otps'

const OtpSchema = new Schema(
    {
        token: { type: String, required: true },
        email: { type: String, required: true },
        type: { type: String, enum: Object.values(VerifyType) },
        expiresAt: { type: Date, default: Date.now, expires: 60 }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
)

const OTP = model(DOCUMENT_NAME, OtpSchema)
module.exports = OTP
