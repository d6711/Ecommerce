const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require("vnpay")
const { env, OrderStatus } = require("../../../config/constants")
const { Order } = require("../../../models/order.model")
const { BadRequest } = require("../../../core/error.exception")

function createVnPay({ orderId, amount }) {
    const vnpay = new VNPay({
        tmnCode: env.VNP_TMN_CODE,
        secureSecret: env.VNP_HASH_SECRET,
        vnpayHost: 'https://sandbox.vnpayment.vn',
        queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger,
    })
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: '13.160.92.202',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/v1/api/checkout/vnpay/callback',
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
    })

    return { paymentUrl }
}

async function callbackVnPay(query) {
    const orderId = query.vnp_TxnRef
    if (query.vnp_ResponseCode !== '00') {
        await Order.updateOne({ _id: orderId }, { status: OrderStatus.FAILED })
        throw new BadRequest(`Failed to checkout, error response: ${query.vnp_ResponseCode}`)
    }
    await Order.updateOne({ _id: orderId }, { status: OrderStatus.PAID })
    return {
        orderInfo: query.vnp_OrderInfo,
        total: parseInt(query.vnp_Amount, 10) / 100,
        bankCode: query.vnp_BankCode,
        cardType: query.vnp_CardType,
    }
}

module.exports = {
    createVnPay,
    callbackVnPay
}