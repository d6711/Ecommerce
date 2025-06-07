const { env, HttpStatus, HttpCode } = require("@config/constants")

function asyncHandler(fun) {
    return function (req, res, next) {
        fun(req, res, next).catch(next)
    }
}

function handleError(error, req, res, next) {
    const statusCode = error.status || HttpCode.INTERNAL_SERVER_ERROR
    return res.status(statusCode).json({
        error: true,
        statusCode: statusCode,
        message: error.message || HttpStatus.INTERNAL_SERVER_ERROR,
        stack: env.NODE_ENV === 'development'
            ? error.stack?.split('\n').map(err => err.trim())
            : undefined
    })
}

function validate(schema) {
    return function (req, res, next) {
        const { error } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            const statusCode = HttpCode.BAD_REQUEST
            return res.status(statusCode).json({
                error: true,
                statusCode: statusCode,
                message: error.details.map(detail => detail.message)
            })
        }
        next()
    }
}

module.exports = {
    asyncHandler,
    handleError,
    validate
}


