const nodemailer = require('nodemailer')
const { env } = require('./constants')

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
    }
})

module.exports = transport