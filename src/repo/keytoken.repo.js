'use strict'

const keytokenModel = require("../models/keytoken.model")

const findRefreshTokensUsedByRT = async(refreshToken) => {
    return await keytokenModel.findOne({refreshTokensUsed: refreshToken})
}

const findKeyByRefreshToken = async(refreshToken) => {
    return await keytokenModel.findOne({refreshToken: refreshToken})
}

const findKeyTokenByUserId = async(userId) => {
    return await keytokenModel.findOne({userId: userId})
}
const deleteKeyTokenByRefreshToken = async(refreshToken) => {
    return await keytokenModel.deleteOne({refreshToken: refreshToken})
}

const deleteKeyTokenById  = async(keyId) => {
    return await keytokenModel.deleteOne({_id: keyId})
}
module.exports = {
    findRefreshTokensUsedByRT,
    findKeyByRefreshToken,
    findKeyTokenByUserId,
    deleteKeyTokenById,
    deleteKeyTokenByRefreshToken
}