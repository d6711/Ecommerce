require('dotenv/config')

exports.env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    URL_SERVER: process.env.URL_SERVER,
    URL_CLIENT: process.env.URL_CLIENT,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    ClOUDINARY_API_KEY: process.env.ClOUDINARY_API_KEY,
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

exports.Type = {
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
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    DRAFT: 'Draft',
    DELETED: 'Deleted',

    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    PACKED: 'Packed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    RETURNED: 'Returned',
    FAILED: 'Failed',
    SUCCESS: 'Success',
    REFUNDED: 'Refunded',
    PAID: 'Paid',

    AVAILABLE: 'Available', // Có sẵn
    OUT_OF_STOCK: 'Out of Stock', // Hết hàng
    DISCONTINUED: 'Discontinued', // Ngừng kinh doanh

    BANNED: 'Banned',
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
