const mongoose = require('mongoose')
const Category = require('./src/models/category.model')

// pool ảnh có sẵn
const imagesPool = [
    "https://res.cloudinary.com/dbzy5jdmv/image/upload/v1753236118/Ecommerce/images/nkqhyswanix5nsh1be84.png",
    "https://res.cloudinary.com/dbzy5jdmv/image/upload/v1753236119/Ecommerce/images/nlbykkshwd8bflz85v6h.png",
    "https://res.cloudinary.com/dbzy5jdmv/image/upload/v1753235745/Ecommerce/images/j8qnaflbelggdtupnydd.avif",
    "https://res.cloudinary.com/dbzy5jdmv/image/upload/v1753235311/Ecommerce/images/thumb.png"
]

async function updateCategoryImages() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Accessory')

        const categories = await Category.find({})

        for (const cat of categories) {
            const randomImage = imagesPool[Math.floor(Math.random() * imagesPool.length)]
            cat.image = randomImage
            await cat.save()
            console.log(`Updated category ${cat.name} with image ${randomImage}`)
        }

        console.log('✅ Update done!')
        mongoose.disconnect()
    } catch (err) {
        console.error('❌ Error:', err)
    }
}

updateCategoryImages()
