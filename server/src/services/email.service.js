const { env } = require("../config/constants")
const transport = require("../config/nodemailer")
const { BadRequest } = require("../core/error.exception")

class EmailService {
    static sendMail({ toEmail, html, text, subject }) {
        try {
            const mailOptions = { from: `XStore <${env.SMTP_USER}>`, to: toEmail, html, text, subject }
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