const { BadRequestException } = require("../core/error.exception")

exports.findDocumentsByQuery = async function ({
    model, filter = {}, search = '', searchFields = [], // search theo field
    page = 1, limit = 10, sortBy = { createdAt: -1 }, order = 'desc', // giảm dần
    select = '' // lấy ra field
}) {
    try {
        page = +page
        limit = +limit
        const query = { ...filter }
        if (!['asc', 'desc'].includes(order)) {
            throw new BadRequestException('Order must be asc or desc')
        }
        if (search) {
            if (searchFields.length > 0) {
                query.$or = searchFields.map(field => ({
                    [field]: { $regex: search, $options: 'i' }
                }))
            } else {
                query.$text = { $search: search }
            }
        }

        const skip = (page - 1) * limit
        const sortOption = { [sortBy]: order === "desc" ? -1 : 1 }
        console.log(query)
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
            totalDocuments,
            page,
            limit,
            totalPages: Math.ceil(totalDocuments / limit),
            data,
        }
    } catch (error) {
        throw new BadRequestException(`Invalid query: ${error.message}`)
    }
}