'use strict'

const { CREATED, SuccessResponse } = require("../responses/success.response")
const CouponService = require("../services/coupon.service")

class CouponController{
    static createCoupon = async(req, res) => {
        new CREATED({
            message: 'Coupon created successfully',
            metadata: await CouponService.createCoupon(req.user, req.body)
        }).send(res)
    }

    static updateProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Coupon updated successfully',
            metadata: await CouponService.updateCoupon(req.params.couponId, req.body)
        }).send(res)
    }

    static deleteCoupon = async(req, res) => {
        new SuccessResponse({
            message: 'Coupon deleted successfully',
            metadata: await CouponService.deleteCoupon(req.user, req.params.couponId)
        }).send(res)
    }

    static applyCoupon = async(req, res) => {
        new SuccessResponse({
            message: 'Coupon applied successfully',
            metadata: await CouponService.applyCoupon(req.body)
        }).send(res)
    }

    static getCouponByShop = async(req, res) => {
        new SuccessResponse({
            message: 'Coupons retrieved successfully',
            metadata: await CouponService.getCouponByShop(req.params.shopId)
        }).send(res)
    }

    static getAllCoupon = async(req, res) => {
        new SuccessResponse({
            message: 'All coupons retrieved successfully',
            metadata: await CouponService.getAllCoupon()
        }).send(res)
    }
}

module.exports = CouponController