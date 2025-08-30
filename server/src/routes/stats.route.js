const { Router } = require('express')
const { asyncHandler } = require('../middlewares/handleError')
const statsController = require('../controllers/stats.controller')

const router = Router()

router.get('/stats', asyncHandler(statsController.getStats))

module.exports = router