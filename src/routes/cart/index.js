'use strict'
const express = require('express')
const { authentication } = require('../../auth')
const { asyncHandler } = require('../../middlewares')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()

router.use(asyncHandler(authentication))
router.get('/list', asyncHandler(CartController.listAllProduct))
router.post('/create', asyncHandler(CartController.addToCart))
router.post('/review', asyncHandler(CartController.reviewBillInfomation))
router.delete('/delete/item/:productId', asyncHandler(CartController.deleteItem))
router.delete('/delete/all', asyncHandler(CartController.deleteCart))



module.exports = router