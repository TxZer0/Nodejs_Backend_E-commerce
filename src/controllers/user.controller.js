'use strict'
const {CREATED, SuccessResponse} = require('../responses/success.response')
const UserService = require('../services/user.service')
const { HEADER } = require('../utils')

class UserController{
    static signup = async(req, res) => {
        new CREATED({
            message: 'Signup success',
            metadata: await UserService.signup(req.body)
        }).send(res)
    }

    static login = async(req, res) => {
        new SuccessResponse({
            message: 'Login success',
            metadata: await UserService.login(req.body)
        }).send(res)
    }

    static logout  = async(req, res) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await UserService.logout(req.keyToken)
        }).send(res)
    }

    static handlerRefreshToken = async(req, res) => {
        new SuccessResponse({
            message: 'Success',
            metadata: await UserService.handlerRefreshToken(req.user, req.headers[HEADER.REFRESH_TOKEN])
        }).send(res)
    }

    static forgotPassword = async(req, res) => {
        new SuccessResponse({
            message: 'Success',
            metadata: await UserService.forgotPassword(req.body.email)
        }).send(res)
    }

    static resetPassword = async(req, res) => {
        new SuccessResponse({
            message: 'Success',
            metadata: await UserService.resetPassword(req.query)
        }).send(res)
    }

    static changePassword = async(req, res) => {
        new SuccessResponse({
            message: 'Password updated successfully',
            metadata: await UserService.changePassword(req.query, req.body)
        }).send(res)
    }
}

module.exports = UserController
