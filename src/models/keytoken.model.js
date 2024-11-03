'use strict'

const {Schema, model, Types} = require('mongoose')

const DOCUMENT_NAME = 'KeyToken'
const COLLECTION_NAME = 'KeyTokens'
const keyTokenSchema = new Schema({
    userId: {type: Types.ObjectId, ref: 'User', required: true},
    refreshToken: {type: String, required: true},
    refreshTokensUsed: {type: Array, default: []}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)