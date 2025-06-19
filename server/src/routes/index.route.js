const { Router } = require('express')
const router = Router()

router.use('/auth', require('./auth.route'))
router.use('/categories', require('./category.route'))
router.use('/upload', require('./upload.route'))

module.exports = router