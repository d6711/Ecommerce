const AccessControl = require('accesscontrol')
const { Unauthorized } = require('../core/error.exception')
const { roleList } = require('../services/rbac.service')
const { getUserById } = require('../helpers/auth.helper')

const rbac = new AccessControl()

function grantAccess(action, resource) {
    return async function (req, res, next) {
        try {
            rbac.setGrants(await roleList())
            const user = await getUserById(req.user.userId)
            const rolName = user.role
            const permission = rbac.can(rolName)[action](resource)
            if (!permission.granted) throw new Unauthorized('You dont have enough permission')
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}





