const { BadRequest } = require("../core/error.exception")
const { getUserById } = require("../helpers/auth.helper")
const Resource = require("../models/resource.model")
const Role = require("../models/role.model")
const User = require("../models/user.model")

class RbacService {
    static async setRole({ userId, role }) {
        const user = await getUserById(userId)
        if (!user) throw new BadRequest('User not found')

        const roleGrant = await Role.findOne({ name: role })
        if (!roleGrant) throw new BadRequest('Role not found')

        return await User.updateOne({ _id: userId }, { role: roleGrant._id })
    }
    static async getRoleNameByUserId(userId) {
        const user = await User.findById(userId).populate('role').lean()
        return user.role.name
    }

    static async createRole(body) {
        return await Role.create(body)
    }

    static async setRoleUser(userId) {
        const role = await Role.findOne({ name: 'user' })
        return await User.updateOne({ _id: userId }, { role: role._id })
    }

    static async getRoleList() {
        return await Role.aggregate([
            {
                $unwind: '$grants'

            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    role: '$name',
                    resource: '$resource.name',
                    action: '$grants.actions',
                    attributes: '$grants.attributes'
                }
            },
            {
                $unwind: '$action'
            },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: '$action',
                    attributes: 1
                }
            }
        ])
    }
    static async createResource(body) {
        return await Resource.create(body)
    }
    static async getResourceList() {
        return await Resource.aggregate([
            {
                $project: {
                    name: '$name',
                    slug: '$slug',
                    description: '$description',
                    resourceId: '$_id',
                    createdAt: 1
                }
            }
        ])
    }
    static updateRole(id, bodyUpdate) {
        const role = Role.findById(id)
        if (!role) throw new BadRequest('Role not found')
        return Role.updateOne({ _id: id }, bodyUpdate)
    }

}

module.exports = RbacService