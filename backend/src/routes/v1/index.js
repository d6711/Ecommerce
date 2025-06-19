const { Router } = require('express')
const router = Router()

router.use('/auth', require('./auth'))
router.use('/categories', require('./category'))
router.use('/upload', require('./upload'))

module.exports = router