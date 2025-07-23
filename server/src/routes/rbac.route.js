const express = require('express')
const { asyncHandler } = require('../middlewares/handleError')
const rbacController = require('../controllers/rbac.controller')
const router = express.Router()

router.post('/role', asyncHandler(rbacController.newRole))
router.post('/resource', asyncHandler(rbacController.newResource))

router.get('/role', asyncHandler(rbacController.listRole))
router.get('/resource', asyncHandler(rbacController.listResource))

module.exports = router
