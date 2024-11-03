'use strict'

const {Types, Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
const inventorySchema = new Schema({
    invent_shopId: {type: Types.ObjectId, ref: 'User', required: true},
    invent_products: {type: Array, default: []},
    invent_location: {type: String, default: ''},
    invent_phone: {type: String, default: ''}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, inventorySchema)