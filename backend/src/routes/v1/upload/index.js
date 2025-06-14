const uploadDisk = require('@config/multer')
const uploadController = require('@controllers/upload.controller')
const { authentication } = require('@middlewares/auth')
const { asyncHandler, validate } = require('@middlewares/handleError')
const { Router } = require('express')
const router = Router()

router.post('/imageUrl', asyncHandler(uploadController.uploadFromUrl))
router.post('/file', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileFromLocal))
router.post('/files', uploadDisk.array('files', 5), asyncHandler(uploadController.uploadMultipleFiles))

module.exports = router