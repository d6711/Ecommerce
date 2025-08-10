const { Schema, Types, model } = require('mongoose')
const { Status, Roles } = require('../config/constants')

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
        // role: {
        //     type: String,
        //     enum: Object.values(Roles),
        //     default: Roles.USER,
        // },
        role: { type: Types.ObjectId, ref: 'Role' },
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

UserSchema.index({ email: 1 }, { unique: true })

const User = model(DOCUMENT_NAME, UserSchema)
module.exports = User
