const { env } = require("../../config/constants")
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require("vnpay")
const { BadRequest } = require("../../core/error.exception")
const axios = require('axios')
const crypto = require('crypto')

function vnPayment({ orderId, amount }) {
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
        vnp_ReturnUrl: 'http://localhost:3000/v1/api/checkout/vnpay-return',
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
    })

    return { paymentUrl }
}
async function momoPayment({ orderId, amount }) {
    const momoConfig = {
        partnerCode: "MOMO",
        accessKey: "F8BBA842ECF85",
        secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
        endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
        redirectUrl: "http://localhost:3000/v1/api/checkout/momo/callback",
        ipnUrl: "http://localhost:3000/v1/api/checkout/momo/ipn"
    }

    const { partnerCode, accessKey, secretKey, redirectUrl, ipnUrl } = momoConfig
    const requestId = Date.now().toString()
    const orderInfo = `Thanh toán đơn hàng ${orderId}`
    const requestType = "captureWallet"
    const extraData = ''

    const rawSignature = `accessKey=${accessKey}` +
        `&amount=${amount}` +
        `&extraData=${extraData}` +
        `&ipnUrl=${ipnUrl}` +
        `&orderId=${orderId}` +
        `&orderInfo=${orderInfo}` +
        `&partnerCode=${partnerCode}` +
        `&redirectUrl=${redirectUrl}` +
        `&requestId=${requestId}` +
        `&requestType=${requestType}`

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
    const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi'
    }


    try {
        const response = await axios.post(momoConfig.endpoint, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = response.data

        if (data.resultCode !== 0) {
            throw new BadRequest(`Momo Error: ${data.message || 'Thanh toán thất bại'} (code ${data.resultCode})`)
        }
        return {
            payUrl: data.payUrl,               // URL để redirect người dùng
            qrCodeUrl: data.qrCodeUrl || null, // Có thể có với một số loại thanh toán
            deeplink: data.deeplink || null,   // Dành cho mobile app
            transId: data.transId,
            orderId: data.orderId,
            message: data.message,
            requestId: data.requestId
        }
    } catch (error) {
        throw new BadRequest('Failed checkout', error.message)
    }
}

function zaloPayment() { }

module.exports = {
    vnPayment,
    momoPayment,
    zaloPayment
}