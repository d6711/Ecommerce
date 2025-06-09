const Joi = require('joi')

const registerUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().min(100000).max(999999).required(),
})

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
})

const verifyPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().min(100000).max(999999).required(),
    newPassword: Joi.string().required(),
})

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().min(100000).max(999999).required(),
    newPassword: Joi.string().required(),
})

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
})
module.exports = {
    registerUserSchema,
    loginUserSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    verifyPasswordSchema,
    registerUserSchema,
    resetPasswordSchema,
    changePasswordSchema
}