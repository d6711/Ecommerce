const _ = require('lodash')
const { Types } = require('mongoose')
const { BadRequestException } = require('../core/error.exception')

exports.convertObjectId = function (id) {
    if (typeof id === 'string')
        return new Types.ObjectId(id)
}

exports.getInfoData = function ({ fields = [], object = {} }) {
    return _.pick(object, fields)
}

exports.validTime = function (startDate, endDate) {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (now < start || now > end) {
        const startStr = new Date(start).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const endStr = new Date(end).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        throw new BadRequestException(`Discount valid from ${startStr} to ${endStr}`);
    }
}

exports.flattenNestedArray = function ({ array, childrenKey = "children" }) {
    const flat = []
    for (const item of array) {
        const { [childrenKey]: children, ...rest } = item
        flat.push(rest)
        if (children && children.length > 0) {
            flat.push(...exports.flattenNestedArray({ array: children, childrenKey }))
        }
    }
    return flat
}

exports.generateSlug = function (text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+|-+$/g, '')
}
