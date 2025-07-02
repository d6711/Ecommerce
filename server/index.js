const crypto = require('crypto')

const signature = crypto.createHmac('sha256', '123').update('1').digest('hex')
const signature2 = crypto.createHmac('sha256', '123').update('1').digest('hex')

console.log(signature)
console.log(signature2)