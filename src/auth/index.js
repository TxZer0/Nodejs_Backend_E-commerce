'use strict'

const { findKeyTokenByUserId } = require("../repo/keytoken.repo")
const { BadRequestError, ForbiddenError, AuthFailureError } = require("../responses/error.response")
const { HEADER } = require("../utils")
const jwt = require('jsonwebtoken')
const authentication = async(req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) 
        throw new BadRequestError('Bad request')

    const keyToken = await findKeyTokenByUserId(userId)
    if(!keyToken)
        throw new ForbiddenError('Access denied')

    const token = req.headers[HEADER.ACCESS_TOKEN] || req.headers[HEADER.REFRESH_TOKEN]
    if(!token)
        throw new BadRequestError('Bad request')

    const isAccessToken = req.headers[HEADER.ACCESS_TOKEN] ? true: false
    try {
        const decode = jwt.verify(token, isAccessToken === true ? process.env.ACCESS_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET)
        if(!decode)
            throw new AuthFailureError('Authentication failed')
        req.user = decode
        req.keyToken = keyToken
        return next()
    } catch (error) {
        throw new AuthFailureError('Authentication failed')
    }
}

const checkApiKey = async(req, res, next) => {
    try {
        const apiKey = req.headers[HEADER.API_KEY]
        if(apiKey !== process.env.API_KEY)
            throw new AuthFailureError('Unauthorized')
        return next()
    } catch (error) {
        throw new AuthFailureError('Unauthorized')
    }
}

module.exports = {
    authentication,
    checkApiKey
}