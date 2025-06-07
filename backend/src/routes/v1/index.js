const { Router } = require('express')
const router = Router()

router.use('/auth/user', require('./auth/client'))
router.use('/auth/admin', require('./auth/admin'))

module.exports = router