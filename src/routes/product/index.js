'use strict'
const express = require('express')
const { asyncHandler } = require('../../middlewares')
const ProductController = require('../../controllers/product.controller')
const { authentication } = require('../../auth')
const router = express.Router()

router.get('/search/:productName', asyncHandler(ProductController.searchProduct))

router.use(asyncHandler(authentication))

router.post('/create', asyncHandler(ProductController.createProduct))
router.get('/delete/:productId', asyncHandler(ProductController.deleteProduct))
router.patch('/update/:productId', asyncHandler(ProductController.updateProduct))

router.get('/publish/:productId', asyncHandler(ProductController.publishProduct))
router.get('/unPublish/:productId', asyncHandler(ProductController.unPublishProduct))

router.get('/list/publish', asyncHandler(ProductController.listAllPublishProduct))
router.get('/list/unPublish', asyncHandler(ProductController.listAllUnPublishProduct))



module.exports = router