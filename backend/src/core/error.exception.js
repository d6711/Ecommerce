const { HttpCode, HttpStatus } = require('@config/constants')

class HttpException extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BadRequest extends HttpException {
    constructor(message = HttpStatus.BAD_REQUEST, status = HttpCode.BAD_REQUEST) {
        super(message, status)
    }
}

class Unauthorized extends HttpException {
    constructor(message = HttpStatus.UNAUTHORIZED, status = HttpCode.UNAUTHORIZED) {
        super(message, status)
    }
}

class Forbidden extends HttpException {
    constructor(message = HttpStatus.FORBIDDEN, status = HttpCode.FORBIDDEN) {
        super(message, status)
    }
}

class NotFound extends HttpException {
    constructor(message = HttpStatus.NOT_FOUND, status = HttpCode.NOT_FOUND) {
        super(message, status)
    }
}

class Conflict extends HttpException {
    constructor(message = HttpStatus.CONFLICT, status = HttpCode.CONFLICT) {
        super(message, status)
    }
}

module.exports = {
    BadRequest,
    Conflict,
    Forbidden,
    NotFound,
    Unauthorized
}

