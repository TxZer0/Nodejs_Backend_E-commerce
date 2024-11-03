'use strict'

const {Schema, Types, model} = require('mongoose')

const DOCUMENT_NAME = 'Coupon'
const COLLECTION_NAME = 'Coupon'

const couponSchema = new Schema({
    coupon_name: {type: String, required: true},
    coupon_code: {type: String, required: true},
    coupon_description: {type: String, required: true},
    coupon_value: {type: Number, required: true},
    coupon_quantity: {type: Number, required: true},
    coupon_discount_type: {type: String, enum: ['Percent', 'Fix']},
    coupon_max_used: {type: Number, default: 1},
    coupon_type_product: {type: String, enum: ['specific','all'], default: 'specific'},
    coupon_productId: {type: Array, default: []},
    coupon_start_date: {type: Date, default: true},
    coupon_end_date: {type: Date, required: true},
    coupon_order_min_value: {type: Number, required: true},
    coupon_shopId: {type: Types.ObjectId, ref: 'User'},
    coupon_users_usedId: {type: Array, default: []},
    coupon_is_active: {type: Boolean, default: true}
    
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, couponSchema)