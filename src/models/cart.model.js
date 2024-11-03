'use strict'

const {Types, Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
const cartSchema = new Schema({
    cart_products: {type: Array, default: []},
    cart_userId: {type: Types.ObjectId, ref: 'User'},
    cart_count_product: {type: Number, required: true}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, cartSchema)