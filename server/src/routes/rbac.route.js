const express = require('express')
const { asyncHandler } = require('../middlewares/handleError')
const rbacController = require('../controllers/rbac.controller')
const { grantAccess } = require('../middlewares/rbac')
const { authentication } = require('../middlewares/auth')
const router = express.Router()

router.get('/role/:userId', asyncHandler(rbacController.getRoleNameByUserId))
router.get('/role/:roleName/permissions', asyncHandler(rbacController.getRoleByRoleName))
router.use(authentication)
router.get('/role', grantAccess('readAny', 'role'), asyncHandler(rbacController.getRoleList))
router.get('/roleList', grantAccess('readAny', 'role'), asyncHandler(rbacController.getRoles))
router.post('/role', grantAccess('createAny', 'role'), asyncHandler(rbacController.createRole))
router.patch('/role', grantAccess('updateAny', 'role'), asyncHandler(rbacController.setRole))
router.patch('/role/:id', grantAccess('updateAny', 'role'), asyncHandler(rbacController.updateRole))

router.get('/resource', grantAccess('readAny', 'resource'), asyncHandler(rbacController.getResourceList))
router.post('/resource', grantAccess('createAny', 'resource'), asyncHandler(rbacController.createResource))

module.exports = router
