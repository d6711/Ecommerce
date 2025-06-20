const { Router } = require('express')
const Product = require('../models/product.model')
const router = Router()

router.use('/auth', require('./auth.route'))
router.use('/categories', require('./category.route'))
router.use('/products', require('./product.route'))
router.use('/upload', require('./upload.route'))

router.post('/seed', async (req, res) => {
    return res.json({ data: await Product.insertMany(req.body) })
})

module.exports = router