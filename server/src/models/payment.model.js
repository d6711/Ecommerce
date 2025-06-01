const { Schema, Types, model } = require('mongoose')

const DOCUMENT_NAME = 'Payment'
const COLLECTION_NAME = 'Payments'

const PaymentSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: 'User', required: true }, // Người thanh toán
        orderId: { type: Types.ObjectId, ref: 'Order', required: true }, // Đơn hàng liên quan
        amount: { type: Number, required: true, min: 0 }, // Số tiền thanh toán
        method: { type: String, required: true }, // Phương thức thanh toán (ví dụ: 'credit_card', 'paypal', 'cash')
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        }, // Trạng thái thanh toán
        transactionId: { type: String }, // Mã giao dịch bên thứ 3 (nếu có)
        paymentDate: { type: Date, default: Date.now }, // Thời gian thanh toán
        note: { type: String }, // Ghi chú nếu cần
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

module.exports = {
    Payment: model(DOCUMENT_NAME, PaymentSchema)
}
