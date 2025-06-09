// const { Schema, model, Types } = require('mongoose')

// const DOCUMENT_NAME = 'Banner'
// const COLLECTION_NAME = 'Banners'

// const BannerSchema = new Schema({
//     title: { type: String, required: true },
//     image: String,
//     link: String,
//     position: {
//         type: String,
//         enum: ['homepage', 'category', 'product', 'custom'],
//         default: 'homepage'
//     },
//     isActive: { type: Boolean, default: true },
//     startDate: { type: Date, default: Date.now },
//     endDate: { type: Date },
//     order: { type: Number, default: 0 }, // Để sắp xếp thứ tự banner
// }, {
//     timestamps: true,
//     collection: COLLECTION_NAME
// })

// module.exports = model(DOCUMENT_NAME, BannerSchema)
