const Joi = require('joi')

const createCategory = Joi.object({
    name: Joi.string().required(),
    parentId: Joi.string().length(24),
    image: Joi.string(),
    description: Joi.string(),
    isActive: Joi.boolean().default(true)
})

const updateCategory = Joi.object({
    name: Joi.string(),
    parentId: Joi.string().length(24),
    image: Joi.string(),
    description: Joi.string(),
    isActive: Joi.boolean()
})

module.exports = {
    createCategory,
    updateCategory
}