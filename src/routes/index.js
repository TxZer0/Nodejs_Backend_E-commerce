const express = require('express')
const user = require('./user')
const product = require('./product')
const discount = require('./coupon')
const cart = require('./cart')
const { asyncHandler } = require('../middlewares')
const { checkApiKey } = require('../auth')
const router = express.Router()

router.use(asyncHandler(checkApiKey))

router.use('/api/v1/user', user)
router.use('/api/v1/product', product)
router.use('/api/v1/coupon', discount)
router.use('/api/v1/cart', cart)

module.exports = router
