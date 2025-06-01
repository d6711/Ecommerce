const { HttpCode, HttpStatus } = require('../configs/constants')
class Success {
    constructor({
        message,
        httpCode = HttpCode.OK,
        httpStatus = HttpStatus.OK,
        options,
        metadata,
    }) {
        this.message = message || httpStatus
        this.statusCode = httpCode
        if (options && Object.keys(options).length > 0) {
            this.options = options
        }
        this.metadata = metadata
    }
    toJSON() {
        const obj = {
            message: this.message,
            statusCode: this.statusCode,
        }
        if (this.options) {
            obj.options = this.options
        }
        if (this.metadata) {
            obj.metadata = this.metadata
        }
        return obj
    }

    send(res, headers = {}) {
        Object.keys(headers).forEach((key) => {
            res.setHeader(key, headers[key])
        })
        return res.status(this.statusCode).json(this)
    }
}

module.exports = Success