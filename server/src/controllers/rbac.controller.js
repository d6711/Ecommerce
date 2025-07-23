const { createRole, createResource, roleList, resourceList } = require("../services/rbac.service")
const { Success } = require('../core/success.response')

class RbacController {
    async newRole(req, res) {
        new Success({
            message: 'Created role',
            metadata: await createRole(req.body)
        }).send(res)
    }
    async newResource(req, res) {
        new Success({
            message: 'Created resource',
            metadata: await createResource(req.body)
        }).send(res)
    }
    async listRole(req, res) {
        new Success({
            message: 'Get list role resource',
            metadata: await roleList(req.query)
        }).send(res)
    }
    async listResource(req, res) {
        new Success({
            message: 'Get list resource',
            metadata: await resourceList(req.query)
        }).send(res)
    }
}

module.exports = new RbacController()