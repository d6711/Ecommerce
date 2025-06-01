const { env, HttpStatus, HttpCode } = require("../configs/constants")

exports.asyncHandler = function (fun) {
    return function (req, res, next) {
        fun(req, res, next).catch(next)
    }
}

exports.handleError = function (error, req, res, next) {
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

exports.validate = function (schema) {
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



