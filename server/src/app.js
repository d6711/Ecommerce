const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv/config')
const path = require('path')
const { handleError } = require('./middlewares/handleError')
require('./configs/database')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', require('./routes'))

app.use((req, res, next) => {
    const error = new Error('URl NOT FOUND')
    error.status = 404
    next(error)
})

app.use(handleError)

module.exports = app
