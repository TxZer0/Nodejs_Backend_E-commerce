'use strict'

const {Types, Schema, model} = require('mongoose')
const removeAccents = require('remove-accents')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_name_no_diacritics: {type: String, required: true},
    product_price: {type: Number, required: true},
    product_description: {type: String, required: true},
    product_shop: {type: Types.ObjectId, ref: 'User', required: true},
    product_type: {type: String, enum: ['Jean','Shoes','Glasses'], required: true},
    product_attribute: {
        size: {type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true},
        color: {type: String, required: true},
        style: {type: String, default: 'Basic'},
    },
    product_quantity: {type: Number, required: true},
    product_brand: {type: String, default: ''},
    product_rating: {type: Number, default: 0.0},
    product_images: { type: Array, default: [] },
    isPublished: {type: Boolean, default: false}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})
productSchema.index({product_name_no_diacritics: 'text'})
module.exports = model(DOCUMENT_NAME, productSchema)