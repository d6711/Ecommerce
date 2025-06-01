const _ = require('lodash');
const { Types } = require('mongoose');
const { BadRequestException } = require('../core/error.exception');

function convertObjectId(id) {
    if (typeof id === 'string')
        return new Types.ObjectId(id);
}

function getInfoData({ fields = [], object = {} }) {
    return _.pick(object, fields);
}

function validTime(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start || now > end) throw new BadRequestException('Invalid discount time')
}

function flattenNestedArray({ array, childrenKey = "children" }) {
    const flat = [];
    for (const item of array) {
        const { [childrenKey]: children, ...rest } = item;
        flat.push(rest);
        if (children && children.length > 0) {
            flat.push(...flattenNestedArray({ array: children, childrenKey }));
        }
    }
    return flat;
}

function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

module.exports = {
    convertObjectId,
    getInfoData,
    validTime,
    flattenNestedArray,
    generateSlug,
};
