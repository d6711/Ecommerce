const AccessControl = require('accesscontrol')
const { Unauthorized } = require('../core/error.exception')
const { getUserById } = require('../helpers/auth.helper')
const RbacService = require('../services/rbac.service')

const rbac = new AccessControl()

function grantAccess(action, resource) {
    return async function (req, res, next) {
        try {
            rbac.setGrants(await RbacService.getRoleList())
            const rolName = await RbacService.getRoleNameByUserId(req.user.userId)
            const permission = rbac.can(rolName)[action](resource)
            if (!permission.granted) throw new Unauthorized("You don't have enough permission...")
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}





