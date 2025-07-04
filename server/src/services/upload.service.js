const { BadRequest } = require("../core/error.exception")
const cloudinary = require('../config/cloudinary')

async function uploadImageFromUrl() {
    const urlImage = 'https://res.cloudinary.com/dbzy5jdmv/image/upload/v1745569038/cld-sample-3.jpg'
    const folderName = 'EcommerceV2/images'
    const newFileName = 'test001'
    const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
    })
    return result
}

async function uploadImageFromLocal(file) {
    const folderName = 'EcommerceV2/images'
    if (!file) throw new BadRequest('File not found')
    const result = await cloudinary.uploader.upload(file, {
        public_id: 'thumb',
        folder: folderName
    })
    return {
        imageUrl: result.secure_url,
        imageId: 1001,
        thumbUrl: await cloudinary.url(result.public_id, {
            height: 100,
            width: 100,
            crop: 'fill',
            format: 'jpg'
        })
    }
}
async function uploadMultipleFilesFromLocal(files) {
    const folderName = 'EcommerceV2/images'
    if (!files.length) throw new BadRequest('Files not found')
    const uploadedUrl = []
    for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folderName
        })
        uploadedUrl.push({
            imageUrl: result.secure_url,
            shopId: 2502,
            thumbUrl: await cloudinary.url(result.public_id, {
                height: 250,
                width: 250,
                format: "jpg",
            }),

        })
    }
    return uploadedUrl
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadMultipleFilesFromLocal
}