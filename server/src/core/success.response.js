const { HttpStatus, HttpCode } = require("../config/constants")

class Success {
    constructor({
        message,
        httpCode = HttpCode.OK,
        httpStatus = HttpStatus.OK,
        pagination,
        metadata,
    }) {
        this.message = message || httpStatus
        this.statusCode = httpCode
        if (pagination && Object.keys(pagination).length > 0) {
            this.pagination = pagination
        }
        this.metadata = metadata
    }

    toJSON() {
        const obj = {
            message: this.message,
            statusCode: this.statusCode,
        }
        if (this.pagination) obj.pagination = this.pagination
        if (this.metadata) obj.metadata = this.metadata
        return obj
    }

    send(res, headers = {}) {
        Object.keys(headers).forEach((key) => {
            res.setHeader(key, headers[key])
        })
        return res.status(this.statusCode).json(this)
    }
}

class Created extends Success {
    constructor({ message, pagination, metadata }) {
        super({
            message,
            httpCode: HttpCode.CREATED,
            httpStatus: HttpStatus.CREATED,
            pagination,
            metadata,
        })
    }
}

module.exports = { Success, Created }