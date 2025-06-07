const { BadRequest } = require('@core/error.exception')
const pick = require('lodash/pick')
const { Types } = require('mongoose')

function getInfoData({ object = {}, fields = [] }) {
    return pick(object, fields)
}

function convertToObjectId(id) {
    if (typeof id === 'string') return new Types.ObjectId(id)
}

function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function checkValidTime(startDate, endDate) {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (now < start || now > end) throw new BadRequest(`Invalid time`);
}

module.exports = {
    getInfoData,
    convertToObjectId,
    generateSlug,
    checkValidTime
}