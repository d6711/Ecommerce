const { BadRequest } = require("../../../core/error.exception")
const crypto = require('crypto')
const axios = require('axios')
const { Order } = require("../../../models/order.model")
const { OrderStatus } = require("../../../config/constants")

const momoConfig = {
    partnerCode: "MOMO",
    accessKey: "F8BBA842ECF85",
    secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
    redirectUrl: "http://localhost:3000/v1/api/checkout/momo/callback",
    ipnUrl: "http://localhost:3000/v1/api/checkout/momo/ipn"
}

function generateSignature(secretKey, rawSignature) {
    return crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
}

async function createMomo({ orderId, amount }) {
    const requestId = Date.now().toString()
    const rawSignature = [
        `accessKey=${momoConfig.accessKey}`,
        `amount=${amount}`,
        `extraData=`,
        `ipnUrl=${momoConfig.ipnUrl}`,
        `orderId=${orderId}`,
        `orderInfo=${orderId}`,
        `partnerCode=${momoConfig.partnerCode}`,
        `redirectUrl=${momoConfig.redirectUrl}`,
        `requestId=${requestId}`,
        `requestType=payWithMethod`
    ].join('&')

    const signature = generateSignature(momoConfig.secretKey, rawSignature)
    const requestBody = {
        partnerCode: momoConfig.partnerCode,
        accessKey: momoConfig.accessKey,
        requestId,
        amount,
        orderId,
        orderInfo: orderId,
        redirectUrl: momoConfig.redirectUrl,
        ipnUrl: momoConfig.ipnUrl,
        autoCapture: true,
        extraData: '',
        requestType: 'payWithMethod',
        signature,
        lang: 'vi'
    }

    try {
        const { data } = await axios.post(momoConfig.endpoint, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        })
        if (data.resultCode !== 0) throw new BadRequest(`Momo Error: ${data.message || 'Thanh toán thất bại'} (code ${data.resultCode})`)
        return { payUrl: data.payUrl }
    } catch (error) {
        throw new BadRequest(`Failed to checkout: ${error.message}`)
    }
}

async function callbackMomo(query) {
    const {
        partnerCode, requestId, amount,
        orderId, orderInfo, orderType, transId,
        resultCode, message, payType, responseTime,
        extraData, signature
    } = query

    const rawSignature = [
        `accessKey=${momoConfig.accessKey}`,
        `amount=${amount}`,
        `extraData=${extraData}`,
        `message=${message}`,
        `orderId=${orderId}`,
        `orderInfo=${orderInfo}`,
        `orderType=${orderType}`,
        `partnerCode=${partnerCode}`,
        `payType=${payType}`,
        `requestId=${requestId}`,
        `responseTime=${responseTime}`,
        `resultCode=${resultCode}`,
        `transId=${transId}`
    ].join('&')

    const expectedSignature = generateSignature(momoConfig.secretKey, rawSignature)
    if (signature !== expectedSignature) throw new BadRequest('Signature verification failed')
    if (resultCode === '0' || resultCode === 0) {
        await Order.updateOne({ status: OrderStatus.PAID })
        return { orderId, resultCode, amount }
    } else {
        await Order.updateOne({ status: OrderStatus.FAILED })
        throw new BadRequest(`Payment failed with resultCode ${resultCode}`)
    }

}

module.exports = { createMomo, callbackMomo }
