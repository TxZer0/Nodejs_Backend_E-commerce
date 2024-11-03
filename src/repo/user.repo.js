'use strict'

const keytokenModel = require("../models/keytoken.model")
const userModel = require("../models/user.model")

const findUserByEmail = async({email}) => {
    return await userModel.findOne({
        email: email
    }).lean()
}

const findUserByUsername = async({username}) => {
    return await userModel.findOne({
        username: username
    }).lean()
}

const findUserById = async({id}) => {
    return await userModel.findOne({
        _id: id
    }).lean()
}

const createNewUser = async({username, email, hashPassword}) => {
    return await userModel.create({
        username: username, email: email, password: hashPassword
    })
}

const updateUserPassword = async({userId, newPassword}) => {
    const filter = {
        _id: userId
    }, update = {
        $set : {
            password: newPassword
        }
    }, options = {}
    return await userModel.updateOne(filter, update, options)
}


module.exports = {
    findUserByEmail,
    findUserByUsername,
    createNewUser,
    findUserById,
    updateUserPassword
}