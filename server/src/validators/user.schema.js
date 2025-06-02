const Joi = require("joi")

const registerUserSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(3).required(),
})

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
})

const resetPasswordSchema = Joi.object({
    oldPassword: Joi.string().min(3).required(),
    newPassword: Joi.string().min(3).required(),
})

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().min(100000).max(999999).required()
})

module.exports = {
    registerUserSchema,
    loginUserSchema,
    resetPasswordSchema,
    verifyEmailSchema
}