const Resource = require("../models/resource.model")
const Role = require("../models/role.model")

async function createResource(body) {
    try {
        return await Resource.create(body)
    } catch (error) {
        return error
    }
}

async function resourceList() {
    try {
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
    } catch (error) {
        return error
    }
}

async function createRole(body) {
    try {
        return await Role.create(body)
    } catch (error) {
        return error
    }
}

async function roleList() {
    try {
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
    } catch (error) {
        return error
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}