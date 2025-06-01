const { HttpCode, HttpStatus } = require('../configs/constants')

class HttpException extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BadRequestException extends HttpException {
    constructor(message = HttpStatus.BAD_REQUEST, status = HttpCode.BAD_REQUEST) {
        super(message, status)
    }
}

class UnauthorizedException extends HttpException {
    constructor(message = HttpStatus.UNAUTHORIZED, status = HttpCode.UNAUTHORIZED) {
        super(message, status)
    }
}

class ForbiddenException extends HttpException {
    constructor(message = HttpStatus.FORBIDDEN, status = HttpCode.FORBIDDEN) {
        super(message, status)
    }
}

class NotFoundException extends HttpException {
    constructor(message = HttpStatus.NOT_FOUND, status = HttpCode.NOT_FOUND) {
        super(message, status)
    }
}

class ConflictException extends HttpException {
    constructor(message = HttpStatus.CONFLICT, status = HttpCode.CONFLICT) {
        super(message, status)
    }
}

module.exports = {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnauthorizedException
}

