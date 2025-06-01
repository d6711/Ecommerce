const nodemailer = require('nodemailer')
const { env } = require('./constants')

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
    }
})

module.exports = transport