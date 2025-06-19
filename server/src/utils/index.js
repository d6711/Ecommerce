const { BadRequest } = require('../core/error.exception')
const pick = require('lodash/pick')
const { Types } = require('mongoose')

function getInfoData({ object = {}, fields = [] }) {
    return pick(object, fields)
}

function convertToObjectId(id) {
    if (typeof id === 'string') return new Types.ObjectId(id)
}

function generateSlug(str) {
    return str
        .toLowerCase()
        .normalize('NFD') // Tách dấu khỏi ký tự gốc
        .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
        .replace(/đ/g, 'd') // Chuyển đ -> d
        .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt
        .trim() // Xóa khoảng trắng 2 đầu
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-') // Gộp nhiều dấu gạch ngang thành một
}

function checkValidTime(startDate, endDate) {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (now < start || now > end) throw new BadRequest(`Invalid time`)
}

function sanitizeData(data, fieldsToRemove = ['__v', 'createdAt', 'updatedAt']) {
    const sanitizeOne = (obj) => {
        const result = { ...obj }
        for (const field of fieldsToRemove) {
            delete result[field]
        }
        return result
    }

    if (Array.isArray(data)) {
        return data.map(sanitizeOne)
    }

    return sanitizeOne(data)
}

module.exports = {
    getInfoData,
    convertToObjectId,
    generateSlug,
    checkValidTime,
    sanitizeData
}