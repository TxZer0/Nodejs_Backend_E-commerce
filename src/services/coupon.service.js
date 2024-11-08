'use strict'

const { forEach } = require("lodash")
const couponModel = require("../models/coupon.model")
const { findCouponByCode, createCoupon, updateCouponById, findCouponById, deleteCouponById, findCouponByShopId, findAllCoupon } = require("../repo/coupon.repo")
const { InternalServerError, NotFoundError, AuthFailureError, BadRequestError, ConflictRequestError } = require("../responses/error.response")
const { pickProperties, removeUndefinedOrNullProperties, convertStringToObjectId, omitProperties, isValidCoupon, isAllProductsApplicable } = require("../utils")

class CouponService{
    static createCoupon = async({userId}, coupon) => {
        if(!convertStringToObjectId(userId).equals(coupon.coupon_shopId))
            throw new AuthFailureError('Unauthorization')
        const checkCoupon = await findCouponByCode(coupon.coupon_code)
        if(checkCoupon)
            throw new BadRequestError('Coupon code already exists')
        const newCoupon = await createCoupon(userId, coupon) 
        if(!newCoupon) 
            throw new ConflictRequestError('Failed to create coupon')
        return {
            coupon: omitProperties({object: newCoupon, props: ["_id","__v", "coupon_discount_type", "coupon_max_used", "coupon_type_product", "coupon_shopId", "coupon_users_usedId", "coupon_is_active"]})
        }
    }

    static updateCoupon = async(couponId, coupon) => {
        if(!couponId)
            throw new BadRequestError('Bad request')
        const checkCoupon = await findCouponById(couponId)
        if(!checkCoupon)
            throw new NotFoundError('Coupon not found')
        if(coupon.coupon_shopId)
            coupon.coupon_shopId = null
        const deleteNullFields = await removeUndefinedOrNullProperties(coupon)
        const updateCoupon = await updateCouponById(
            couponId,
            deleteNullFields
        )
        if(!updateCoupon) 
            throw new ConflictRequestError('Failed to update coupon')
        return {
            coupon: omitProperties({object: updateCoupon, props: ["__v", "coupon_discount_type", "coupon_max_used", "coupon_type_product", "coupon_users_usedId", "coupon_is_active"]})
        }
    }


    static deleteCoupon = async({userId}, couponId) => {
        if(!couponId)
            throw new BadRequestError('Bad request')
        const findCoupon = await findCouponById(couponId)
        if(!findCoupon)
            throw new NotFoundError('Coupon not found')
        if(!convertStringToObjectId(userId).equals(findCoupon.coupon_shopId))
            throw new AuthFailureError('Unauthorization')
        const delCoupon = await deleteCouponById(couponId)
        if(!delCoupon)
            throw new ConflictRequestError('Failed to delete coupon')
    }

    static applyCoupon = async({code, products}) => {
        const checkCoupon = await findCouponByCode(code)
        if(!checkCoupon)
            throw new NotFoundError('Coupon not found')

        if(!isValidCoupon(checkCoupon.coupon_code))
            throw new BadRequestError('Coupon has expired')
        
        if(!isAllProductsApplicable(checkCoupon, products) && checkCoupon.coupon_type_product === 'specific')
            throw new BadRequestError('Some products are not eligible for this coupon')

        const {coupon_order_min_value, coupon_value, coupon_discount_type} = checkCoupon

        let totalOrder = 0
        if(coupon_order_min_value > 0){
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.product_quantity * product.product_price)
            }, 0)
            if(totalOrder < coupon_order_min_value){
                throw new BadRequestError(`Discount requires a minimum order value of ${coupon_order_min_value}`)
            }
        }
        const discount_value = coupon_discount_type === 'Fix' ? coupon_value : totalOrder * (coupon_value / 100)
        return {
            total: totalOrder,
            discount: discount_value,
            totalPrice: totalOrder - discount_value
        }
    }

    static getCouponByShop = async(shopId) => {
        if(!shopId)
            throw new BadRequestError('Bad request')
        const findCoupon = await findCouponByShopId(shopId)
        if(!findCoupon)
            throw new NotFoundError('No coupons found for this shop')
        return findCoupon
    }

    static getAllCoupon = async() => {
        const findCoupon = await findAllCoupon()
        if(!findCoupon)
            throw new NotFoundError('Not found')
        return findCoupon
    }
}






module.exports = CouponService
