const { HttpCode, HttpStatus } = require('@config/constants')

class Success {
    constructor({
        message,
        httpCode = HttpCode.OK,
        httpStatus = HttpStatus.OK,
        paginate,
        metadata,
    }) {
        this.message = message || httpStatus
        this.statusCode = httpCode
        if (paginate && Object.keys(paginate).length > 0) {
            this.paginate = paginate
        }
        this.metadata = metadata
    }

    toJSON() {
        const obj = {
            message: this.message,
            statusCode: this.statusCode,
        }
        if (this.paginate) obj.paginate = this.paginate
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
    constructor({ message, paginate, metadata }) {
        super({
            message,
            httpCode: HttpCode.CREATED,
            httpStatus: HttpStatus.CREATED,
            paginate,
            metadata,
        })
    }
}

module.exports = { Success, Created }