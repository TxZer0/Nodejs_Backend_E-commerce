'use strict'
const express = require('express')
const { asyncHandler } = require('../../middlewares')
const { authentication } = require('../../auth')
const CouponController = require('../../controllers/coupon.controller')
const router = express.Router()


router.get('/list/shop/:shopId', asyncHandler(CouponController.getCouponByShop))

router.use(asyncHandler(authentication))
router.get('/list/all', asyncHandler(CouponController.getAllCoupon))
router.post('/apply', asyncHandler(CouponController.applyCoupon))
router.post('/create', asyncHandler(CouponController.createCoupon))
router.patch('/update/:couponId', asyncHandler(CouponController.updateProduct))
router.delete('/delete/:couponId', asyncHandler(CouponController.deleteCoupon))



module.exports = router