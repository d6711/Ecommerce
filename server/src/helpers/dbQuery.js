const { BadRequest } = require("../core/error.exception")

async function pagination({
    model,
    filter = {},
    search = '',
    searchFields = [],
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    select = ''
}) {
    try {
        page = Math.max(1, parseInt(page) || 1)
        limit = Math.max(1, Math.min(100, parseInt(limit) || 10))

        if (!['asc', 'desc'].includes(order)) throw new BadRequest('Order must be asc or desc')

        const query = { ...filter }
        if (search && search.trim()) {
            if (searchFields.length > 0) {
                query.$or = searchFields.map(field => ({
                    [field]: { $regex: search.trim(), $options: 'i' }
                }))
            } else {
                query.$text = { $search: search.trim() }
            }
        }

        const skip = (page - 1) * limit
        const sortOption = { [sortBy]: order === "desc" ? -1 : 1 }

        const [data, totalDocuments] = await Promise.all([
            model.find(query)
                .sort(sortOption)
                .select(select)
                .skip(skip)
                .limit(limit)
                .lean(),
            model.countDocuments(query)
        ])

        return {
            data,
            page,
            limit,
            totalPages: Math.ceil(totalDocuments / limit),
            totalDocuments,
        }
    } catch (error) {
        throw new BadRequest(`Invalid query: ${error.message}`)
    }
}

module.exports = { pagination }
