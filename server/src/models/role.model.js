const { Schema, model, Types } = require('mongoose')
const { Roles, Status } = require('../config/constants')

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

const RoleSchema = new Schema(
    {
        name: {
            type: String,
            default: Roles.USER,
            enum: Object.values(Roles)
        },
        slug: String,
        status: {
            type: String,
            default: Status.ACTIVE,
            enum: Object.values(Status)
        },
        description: String,
        grants: [
            {
                resource: { type: Types.ObjectId, ref: 'Resource', required: true },
                actions: [{ type: String, required: true }],
                attributes: { type: String, default: '*' },
            }
        ]
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)


const Role = model(DOCUMENT_NAME, RoleSchema)
module.exports = Role
