const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const createProduct = Joi.object({
    name: Joi.string().trim().required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    price: Joi.number().min(0).default(0),
    stock: Joi.number().min(0).default(0),
    ratingAvg: Joi.number().min(0).max(5).default(5),
    ratingCount: Joi.number().min(0).default(0),
    description: Joi.string().allow('', null),
    specification: Joi.string().allow('', null),
    brand: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()).default([]),
    categoryId: Joi.string().pattern(objectIdPattern).required(),
    isActive: Joi.boolean().default(true),
    isFeatured: Joi.boolean().default(false),
    soldCount: Joi.number().min(0).default(0)
})

const updateProduct = Joi.object({
    name: Joi.string().trim(),
    images: Joi.array().items(Joi.string().uri()),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    ratingAvg: Joi.number().min(0).max(5),
    ratingCount: Joi.number().min(0),
    description: Joi.string().allow('', null),
    specification: Joi.string().allow('', null),
    brand: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()),
    categoryId: Joi.string().pattern(objectIdPattern),
    isActive: Joi.boolean(),
    isFeatured: Joi.boolean(),
    soldCount: Joi.number().min(0)
})

module.exports = {
    createProduct,
    updateProduct
}
