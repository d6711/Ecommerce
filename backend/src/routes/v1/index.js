const { Router } = require('express')
const router = Router()

router.use('/auth', require('./auth/client'))
// router.use('/auth/admin', require('./auth/admin'))
router.use('/categories', require('./category'))
router.use('/upload', require('./upload'))

module.exports = router