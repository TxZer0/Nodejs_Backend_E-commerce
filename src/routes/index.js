const express = require('express')
const user = require('./user')
const product = require('./product')
const discount = require('./coupon')
const cart = require('./cart')
const { asyncHandler } = require('../middlewares')
const { checkApiKey } = require('../auth')
const router = express.Router()

router.use(asyncHandler(checkApiKey))

router.use('/v1/api/user', user)
router.use('/v1/api/product', product)
router.use('/v1/api/coupon', discount)
router.use('/v1/api/cart', cart)

module.exports = router