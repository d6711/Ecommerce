const { Success } = require("../core/success.response")
const { uploadImageFromLocal, uploadImageFromUrl, uploadMultipleFilesFromLocal } = require("../services/upload.service")

class UploadController {
    async uploadImageFromUrl(req, res) {
        new Success({
            message: 'Upload file successfully',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }
    async uploadImageFromLocal(req, res) {
        const { file } = req
        new Success({
            message: 'Upload file successfully',
            metadata: await uploadImageFromLocal(file.path)
        }).send(res)
    }
    async uploadMultipleFilesFromLocal(req, res) {
        const { files } = req
        new Success({
            message: 'Upload files successfully',
            metadata: await uploadMultipleFilesFromLocal(files)
        }).send(res)
    }
}

module.exports = new UploadController()