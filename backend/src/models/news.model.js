// const { Schema, Types, model } = require('mongoose');

// const NewsSchema = new Schema(
//     {
//         title: { type: String, required: true },
//         slug: String,
//         summary: String,
//         content: String,
//         image: String,
//         catalog: { type: Types.ObjectId, ref: 'NewsCatalog' },
//         tags: [String],
//         isActive: { type: Boolean, default: true },
//         publishedAt: { type: Date, default: Date.now },
//         author: { type: Types.ObjectId, ref: 'User' },
//         views: { type: Number, default: 0 },
//     },
//     {
//         timestamps: true,
//         collection: 'News',
//     },
// );

// NewsSchema.index({ slug: 1 }, { unique: true }); // slug là duy nhất
// NewsSchema.index({ title: 'text', summary: 'text', tags: 'text' }); // tìm kiếm full-text
// NewsSchema.pre('save', function (next) {
//     if (!this.slug) {
//         this.slug = this.title
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .replace(/\s+/g, '-');
//     }
//     next();
// });

// NewsSchema.pre('findOneAndUpdate', function (next) {
//     const update = this.getUpdate();
//     if (update.title && !update.slug) {
//         update.slug = update.title
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .replace(/\s+/g, '-');
//     }
//     next();
// });

// exports.News = model('News', NewsSchema);

// const NewsCatalogSchema = new Schema(
//     {
//         name: { type: String, required: true },
//         slug: String,
//         order: { type: Number, default: 0 },
//         isActive: { type: Boolean, default: true },
//     },
//     {
//         timestamps: true,
//         collection: 'NewsCatalogs',
//     },
// );
// NewsCatalogSchema.pre('save', function (next) {
//     if (!this.slug) {
//         this.slug = this.name
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .replace(/\s+/g, '-');
//     }
//     next();
// });

// NewsCatalogSchema.pre('findOneAndUpdate', function (next) {
//     const update = this.getUpdate();
//     if (update.name && !update.slug) {
//         update.slug = update.name
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .replace(/\s+/g, '-');
//     }
//     next();
// });
// exports.NewsCatalog = model('NewsCatalog', NewsCatalogSchema);
