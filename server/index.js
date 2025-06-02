const crypto = require('crypto')

const x = crypto.randomBytes(10)
const y = crypto.randomBytes(10).toString('hex')

console.log(x)
console.log(y)