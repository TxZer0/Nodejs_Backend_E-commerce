'use strict'
const _ = require('lodash')
const {Types} = require('mongoose')
const jwt = require('jsonwebtoken')
const {InternalServerError, NotFoundError, AuthFailureError} = require('../responses/error.response')
const keyTokenModel = require('../models/keytoken.model')
const nodemailer = require('nodemailer')
const crypto = require('node:crypto')
const productModel = require('../models/product.model')
const { findCouponByCode } = require('../repo/coupon.repo')

const pickProperties = ({object = {}, props = []}) => {
    return  _.pick(object,props)
}

const omitProperties = ({object = {}, props = []}) => {
    return  _.omit(object,props)
}

const createTokenPair = async({userId, username}) => {
    try {
        const accessToken = jwt.sign({userId, username}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1 day'
        })
        const refreshToken = jwt.sign({userId, username}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7 days'
        })
        return {accessToken, refreshToken}
    } catch (error) {
        throw new InternalServerError()
    }
}

const updateKeyToken = async({userId, refreshToken}) => {
    try {
        const filter = {
            userId: userId
        }, update = {
             refreshToken: refreshToken
        }, options = {
            upsert: true, new: true
        }
        return await keyTokenModel.findOneAndUpdate(filter, update, options)
    } catch (error) {
        throw new InternalServerError()
    }
}

const updateKeyTokenV2 = async({userId, old_refreshToken, new_refreshToken}) => {
    try {
        const filter = {
            userId: userId
        }, update = {
             $set: {refreshToken: new_refreshToken},
             $addToSet: {
                refreshTokensUsed: old_refreshToken
             }
        }, options = {
            upsert: true, new: true
        }
        return await keyTokenModel.findOneAndUpdate(filter, update, options)
    } catch (error) {
        throw new InternalServerError()
    }
}

const HEADER = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    CLIENT_ID: 'x-client-id',
    API_KEY: 'authorization'
}

const convertStringToObjectId = (id) => {
    return new Types.ObjectId(id)
}


const sendEmail = async (userRecv, email, resetLink) => {
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Máy chủ SMTP
            port: 465, // Cổng SMTP
            secure: true, // true cho cổng 465
            auth: {
                user: process.env.EMAIL_USER, // Địa chỉ email của bạn
                pass: process.env.EMAIL_PASS, // Mật khẩu hoặc ứng dụng mật khẩu
            },
        });
    
        // Cấu hình nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Địa chỉ email gửi
            to: email, // Địa chỉ email nhận
            subject: 'Reset password', // Tiêu đề email
            html: `
                <p>Hi ${userRecv},</p>
                <p>Click the link below to reset your password. This link will expire in 5 minutes.</p>
                <p><a href="${resetLink}">Here</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br/>The Support Team</p>
            `
        };
    
        return await transporter.sendMail(mailOptions)
    }catch(error){
        throw new InternalServerError()
    }
    
}

const createResetToken = async({userId, email}) => {
    const token = jwt.sign({userId, email}, process.env.RESET_SECRET, {
        expiresIn: '5m'
    })
    if(!token)
        throw new InternalServerError()
    return token
}

const checkToken = async({token, userId}) => {
    const decode = jwt.verify(token, process.env.RESET_SECRET)
    if(decode.userId !== userId) 
        return false
    return true
}

const removeUndefinedOrNullProperties = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            removeUndefinedOrNullProperties(obj[key]);
        }
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        }
    }
    return obj;
}

const isValidCoupon = async(code) => {
    const coupon = await findCouponByCode(code)
    return coupon.coupon_start_date >= Date.now() &&  Date.now() <= coupon.coupon_end_date ? true: false 
}

const isAllProductsApplicable = (coupon, products) => {
    return products.every(product => coupon.coupon_productId.includes(product._id));
};

const isValidPassword = (password) => {
    const hasAlphabet = /[A-Za-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasMinimumLength = password.length >= 8
    return hasAlphabet && hasNumber && hasSpecialChar && hasMinimumLength;
}
module.exports = {
    pickProperties,
    createTokenPair,
    updateKeyToken,
    HEADER,
    convertStringToObjectId,
    updateKeyTokenV2,
    sendEmail,
    createResetToken,
    checkToken,
    removeUndefinedOrNullProperties,
    isValidCoupon,
    omitProperties,
    isAllProductsApplicable,
    isValidPassword
}
