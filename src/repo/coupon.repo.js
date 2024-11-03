'use strict'

const couponModel = require("../models/coupon.model")


const findCouponByCode = async(code) => {
    return await couponModel.findOne({
        coupon_code: code
    }).lean()
}

const createCoupon = async(userId,coupon) => {
    return await couponModel.create({
        coupon_name: coupon.coupon_name,
        coupon_code: coupon.coupon_code,
        coupon_description: coupon.coupon_description,
        coupon_start_date: coupon.coupon_start_date,
        coupon_end_date: coupon.coupon_end_date,
        coupon_order_min_value: coupon.coupon_order_min_value,
        coupon_productId: coupon.coupon_productId,
        coupon_quantity: coupon.coupon_quantity,
        coupon_shopId: userId,
        coupon_value: coupon.coupon_value ,
        coupon_discount_type: coupon.coupon_discount_type    
    })
}

const updateCouponById = async(couponId, coupon, model = couponModel) => {
    return await model.findByIdAndUpdate(
        couponId, 
        coupon,
    {
        new: true
    })
    .lean()
}

const findCouponById = async(couponId) => {
    return await couponModel.findOne({
        _id: couponId
    })
}

const deleteCouponById = async(couponId) => {
    return await couponModel.deleteOne({
        _id: couponId
    }).lean()
}

const findCouponByShopId = async(shopId) => {
    return await couponModel.find({
        coupon_shopId: shopId,
        coupon_start_date: { $lte: Date.now() },
        coupon_end_date: { $gte: Date.now() }  
    }).lean()
}



const findAllCoupon = async() => {
    return await couponModel.find({
        coupon_start_date: { $lte: Date.now() },
        coupon_end_date: { $gte: Date.now() }  
    }).lean()
}
module.exports = {
    findCouponByCode,
    createCoupon,
    updateCouponById,
    findCouponById,
    deleteCouponById,
    findCouponByShopId,
    findAllCoupon
}