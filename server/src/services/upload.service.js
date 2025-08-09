const { BadRequest } = require("../core/error.exception")
const cloudinary = require('../config/cloudinary')
const fs = require('fs/promises')

async function uploadImageFromUrl() {
    const urlImage = 'https://res.cloudinary.com/dbzy5jdmv/image/upload/v1745569038/cld-sample-3.jpg'
    const folderName = 'Ecommerce/images'
    const newFileName = 'test001'
    const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
    })
    return result
}

const folderName = 'Ecommerce/images'
const uniqueId = `thumb_${Date.now()}`

async function uploadImageFromLocal(file) {
    if (!file) throw new BadRequest('File not found')


    const result = await cloudinary.uploader.upload(file, {
        public_id: uniqueId,
        folder: folderName,
    })

    await fs.unlink(file)

    return {
        imageUrl: result.secure_url,
        publicId: result.public_id,
    }
}

async function uploadMultipleFilesFromLocal(files) {
    if (!files || !files.length) throw new BadRequest('Files not found')

    const uploads = await Promise.all(files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folderName,
        })

        await fs.unlink(file.path)

        return {
            imageUrl: result.secure_url,
            publicId: result.public_id,
        }
    }))

    return uploads
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadMultipleFilesFromLocal
}