const Joi = require('joi')
const { DiscountApplyType, DiscountType } = require('../config/constants')

const createDiscountSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    code: Joi.string().required().uppercase(),
    type: Joi.string().valid(DiscountType.PERCENT, DiscountType.FIXED).default(DiscountType.PERCENT),
    value: Joi.number().min(0).required(),
    maxValue: Joi.number().min(0),
    minOrderValue: Joi.number().min(0).default(0),
    maxUsePerUser: Joi.number().min(1).default(1),
    usedCount: Joi.number().min(0).default(0),
    startDate: Joi.date().default(() => new Date()),
    endDate: Joi.date().required(),
    quantity: Joi.number().min(0),
    applyTo: Joi.string()
        .valid(DiscountApplyType.ALL, DiscountApplyType.PRODUCT, DiscountApplyType.CATEGORY)
        .default(DiscountApplyType.ALL),
    productId: Joi.array()
        .items(Joi.string().length(24).hex()).unique(),
    categoryId: Joi.array()
        .items(Joi.string().length(24).hex()).unique(),
    isActive: Joi.boolean().default(true)
})

const updateDiscountSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    code: Joi.string().uppercase(),
    type: Joi.string().valid(DiscountType.PERCENT, DiscountType.FIXED),
    value: Joi.number().min(0),
    maxValue: Joi.number().min(0),
    minOrderValue: Joi.number().min(0),
    maxUsePerUser: Joi.number().min(1),
    usedCount: Joi.number().min(0),
    startDate: Joi.date(),
    endDate: Joi.date(),
    quantity: Joi.number().min(0),
    applyTo: Joi.string()
        .valid(DiscountApplyType.ALL, DiscountApplyType.PRODUCT, DiscountApplyType.CATEGORY),
    productId: Joi.array()
        .items(Joi.string().length(24).hex()).unique(),
    categoryId: Joi.array()
        .items(Joi.string().length(24).hex()).unique(),
    isActive: Joi.boolean()
})

const applyDiscountSchema = Joi.object({
    code: Joi.string().required(),
    products: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().length(24).required(),
                quantity: Joi.number().integer().min(1).required(),
                price: Joi.number().positive().required(),
            })
        )
        .min(1)
        .required(),
})

module.exports = {
    createDiscountSchema,
    updateDiscountSchema,
    applyDiscountSchema
}