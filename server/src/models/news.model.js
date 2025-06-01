const { Schema, Types, model } = require('mongoose')
const { generateSlug } = require('../utils')

const NewsSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: String,
        summary: String,
        content: String,
        image: String,
        catalog: { type: Types.ObjectId, ref: 'NewsCatalog' },
        tags: [String],
        isActive: { type: Boolean, default: true },
        publishedAt: { type: Date, default: Date.now },
        author: { type: Types.ObjectId, ref: 'User' },
        views: { type: Number, default: 100 },
    },
    {
        timestamps: true,
        collection: 'News',
    },
)

NewsSchema.index({ slug: 1 })
NewsSchema.index({ title: 'text', tags: 'text' }) // tìm kiếm full-text
NewsSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = generateSlug(this.title)
    }
    next()
})

NewsSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate()
    if (update.title && !update.slug) {
        update.slug = generateSlug(update.title)
    }
    next()
})

const NewsCatalogSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: String,
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        collection: 'NewsCatalogs',
    },
)
NewsCatalogSchema.index({ name: 1 })
NewsCatalogSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = generateSlug(this.name)
    }
    next()
})

NewsCatalogSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate()
    if (update.name && !update.slug) {
        update.slug = generateSlug(update.name)
    }
    next()
})

module.exports = {
    News: model('News', NewsSchema),
    NewsCatalog: model('NewsCatalog', NewsCatalogSchema),
}
