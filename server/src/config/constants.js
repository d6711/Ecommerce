require('dotenv/config')

exports.env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    URL_SERVER: process.env.URL_SERVER,
    URL_CLIENT: process.env.URL_CLIENT,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET,
    API_KEY: process.env.API_KEY_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
}

exports.Headers = {
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-key',
    API_KEY: 'x-api-key',
    CLIENT_ID: 'client-id',
}

exports.DiscountType = {
    FIXED: 'Fixed',
    PERCENT: 'Percent',
}

exports.VerifyType = {
    EMAIL: 'Email',
    RESET_PASSWORD: 'Reset Password'
}

exports.DiscountApplyType = {
    ALL: 'All',
    PRODUCT: 'Product',
    CATEGORY: 'Category',
}

exports.HttpCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    GONE: 410,
    INTERNAL_SERVER_ERROR: 500,
}

exports.HttpStatus = {
    BAD_REQUEST: 'Bad Request',
    CONFLICT: 'Conflict',
    CREATED: 'Created',
    FORBIDDEN: 'Forbidden',
    GONE: 'Gone',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    NOT_FOUND: 'Not Found',
    OK: 'OK',
    UNAUTHORIZED: 'Unauthorized',
}

exports.Roles = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    STAFF: 'Staff',
    USER: 'User',
}

exports.Permissions = {
    READ: 'read',
    WRITE: 'write',
    UPDATE: 'update',
    DELETE: 'delete',
}

exports.Status = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    BLOCK: 'Block',
    PENDING: 'Pending',
    DELETED: 'Deleted',
    BANNED: 'Banned'
}

exports.OrderStatus = {
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    PACKED: 'Packed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    RETURNED: 'Returned',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    SUCCESS: 'Success',
    REFUNDED: 'Refunded',
}

exports.StockStatus = {
    AVAILABLE: 'Available',
    OUT_OF_STOCK: 'Out of Stock',
    DISCONTINUED: 'Discontinued',
}

exports.PaymentMethod = {
    COD: 'COD',
    CASH: 'Cash',
    CREDIT_CARD: 'Credit Card',
    PAYPAL: 'PayPal',
    BANK_TRANSFER: 'Bank Transfer',
    MOMO: 'Momo',
    STRIPE: 'Stripe',
    VNPAY: 'VnPay',
    ZALOPAY: 'ZaloPay',
}

