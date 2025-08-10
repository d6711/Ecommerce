const { Success } = require('../core/success.response')
const RbacService = require('../services/rbac.service')

class RbacController {
    async createRole(req, res) {
        new Success({
            message: 'Create new role',
            metadata: await RbacService.createRole(req.body)
        }).send(res)
    }
    async getRoleList(req, res) {
        new Success({
            message: 'Get role list',
            metadata: await RbacService.getRoleList()
        }).send(res)
    }
    async createResource(req, res) {
        new Success({
            message: 'Create new resource',
            metadata: await RbacService.createResource(req.body)
        }).send(res)
    }
    async updateRole(req, res) {
        new Success({
            message: 'Update role',
            metadata: await RbacService.updateRole(req.params.id, req.body)
        }).send(res)
    }
    async getResourceList(req, res) {
        new Success({
            message: 'Get resource list',
            metadata: await RbacService.getResourceList()
        }).send(res)
    }
    async setRole(req, res) {
        new Success({
            message: 'Set role for user',
            metadata: await RbacService.setRole(req.query)
        }).send(res)
    }
}

module.exports = new RbacController()