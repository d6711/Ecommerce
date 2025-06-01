const { Schema, Types, model } = require('mongoose')
const { Roles, Status } = require('../configs/constants')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verify: { type: Boolean, default: false },
        otpCode: Number,
        otpExpires: Date,
        role: {
            type: String,
            enum: [Roles.ADMIN, Roles.USER, Roles.SUPER_ADMIN],
            default: Roles.USER,
        },
        status: {
            type: String,
            enum: [Status.ACTIVE, Status.BANNED],
            default: Status.ACTIVE,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
)

module.exports = {
    User: model(DOCUMENT_NAME, UserSchema)
}
