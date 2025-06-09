const { generateSlug } = require('@utils/index')
const { Schema, Types, model } = require('mongoose')

const DOCUMENT_NAME = 'Category'
const COLLECTION_NAME = 'Categories'

const CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        slug: String,
        image: String,
        parentId: {
            type: Types.ObjectId,
            ref: DOCUMENT_NAME,
            default: null
        },
        description: String,
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

CategorySchema.index({ name: 'text' })
CategorySchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = generateSlug(this.name)
    }
    next()
})

CategorySchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate()
    if (update.name && !update.slug) {
        update.slug = generateSlug(update.name)
    }
    next()
})

const Category = model(DOCUMENT_NAME, CategorySchema)
module.exports = Category