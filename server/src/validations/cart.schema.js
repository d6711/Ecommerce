const Joi = require('joi')

const addToCartSchema = Joi.object({
    productId: Joi.string().length(24).hex().required(),
    quantity: Joi.number().positive().default(1)
})

const updateCartSchema = Joi.object({
    productId: Joi.string().length(24).hex().required(),
    quantity: Joi.number().required()
})

const applyDiscountSchema = Joi.object({
    cartId: Joi.string().length(24).hex().required(),
    discountCode: Joi.string().required()
})

module.exports = {
    addToCartSchema,
    updateCartSchema,
    applyDiscountSchema
}