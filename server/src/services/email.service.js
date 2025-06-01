const { env } = require("../configs/constants")
const transport = require("../configs/nodemailer")
const { BadRequestException } = require('../core/error.exception')

class EmailService {
    static sendMailOtp({ toEmail, html, text, subject }) {
        try {
            const mailOptions = {
                from: 'XStore',
                to: toEmail, html, text, subject
            }
            transport.sendMail(mailOptions, (error, info) => {
                if (error) return error.message
                return info.messageId
            })
        } catch (error) {
            throw new BadRequestException('Failed to send mail:', error.message)
        }
    }
}

module.exports = EmailService