const transport = require("@config/nodemailer")
const { BadRequest } = require("@core/error.exception")

class EmailService {
    static sendMailVerify({ toEmail, html, text, subject }) {
        try {
            const mailOptions = { from: 'XStore', to: toEmail, html, text, subject }
            transport.sendMail(mailOptions, (error, info) => {
                if (error) return error.message
                return info.messageId
            })
        } catch (error) {
            throw new BadRequest(`Failed to send mail: ${error.message}`)
        }
    }
}

module.exports = EmailService