const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const ResourceSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: String,

    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
)

const Resource = model(DOCUMENT_NAME, ResourceSchema)
module.exports = Resource
