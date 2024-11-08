'use strict'
const { findUserByEmail, findUserByUsername, createNewUser, findUserById, updateUserPassword } = require('../repo/user.repo')
const { deleteKeyTokenById, findRefreshTokensUsedByRT, findKeyByRefreshToken} = require('../repo/keytoken.repo')
const {BadRequestError, NotFoundError, AuthFailureError, ConflictRequestError, InternalServerError} = require('../responses/error.response')
const bcrypt = require('bcrypt')
const { pickProperties, createTokenPair, updateKeyToken, updateKeyTokenV2, sendEmail, transporter, createResetToken, checkToken, isValidPassword } = require('../utils')

class UserService{
    static signup = async({username, email, password}) => {
        if(!username || !email || !password)
            throw new BadRequestError('Bad request')
        const checkUserByEmail = await findUserByEmail({email})
        if(checkUserByEmail) 
            throw new BadRequestError('Email has already been registered')

        const checkUserByUsername = await findUserByUsername({username})
        if(checkUserByUsername) 
            throw new BadRequestError('Username has already been registered')

        if(!isValidPassword(password))
            throw new BadRequestError('Password must have at least 8 characters, including a number, an alphabet, and a special character')
        const hashPassword = await bcrypt.hash(password, 10)
        const createUser = await createNewUser({username, email, hashPassword})
        
        return {
            user: pickProperties({object: createUser, props: ['email']})
        }
    }

    static login = async({email, password}) => {
        if(!email || !password)
            throw new BadRequestError('Bad request')
        const checkUserByEmail = await findUserByEmail({email})
        if(!checkUserByEmail) 
            throw new NotFoundError('Incorrect email or password')
        
        const comparePassword = await bcrypt.compare(password, checkUserByEmail.password)
        if(!comparePassword) 
            throw new NotFoundError('Incorrect email or password')

        const tokens = await createTokenPair({userId: checkUserByEmail._id, username: checkUserByEmail.username})
        if(!tokens)
            throw new NotFoundError('Please re-login')
  
        const keyToken = await updateKeyToken({userId: checkUserByEmail._id ,refreshToken: tokens.refreshToken})
        if(!keyToken)
            throw new NotFoundError('Please re-login')

        return tokens
    }

    static logout = async(keyToken) => {
        await deleteKeyTokenById(keyToken._id)
    }

    static handlerRefreshToken = async({userId, username} ,refreshToken) => {
        if(!refreshToken)
            throw new BadRequestError('Bad request')
        const checkReuse = await findRefreshTokensUsedByRT(refreshToken)
        if(checkReuse){
            await deleteKeyTokenById(checkReuse._id)
            throw new AuthFailureError('Please re-login')
        }
  
        const checkToken = await findKeyByRefreshToken(refreshToken)
        if(!checkToken)
            throw new NotFoundError('Please re-login')

        const tokens = await createTokenPair({userId:userId, username: username})
        if(!tokens)
            throw new ConflictRequestError('Please re-login')

        const keyToken = await updateKeyTokenV2({userId: userId ,old_refreshToken: refreshToken , new_refreshToken: tokens.refreshToken})
        if(!keyToken)
            throw new ConflictRequestError('Please re-login')

        return tokens
    }

    static forgotPassword = async(email) => {
        if(!email)
            throw new BadRequestError('Bad request')
        const findUByEmail = await findUserByEmail({email})
        if(!findUByEmail)
            throw new BadRequestError('Invalid email address')

        const resetToken = await createResetToken({userId: findUByEmail._id, email})
        const resetLink = `http://${process.env.HOST}:${process.env.PORT}/reset?token=${resetToken}&id=${findUByEmail._id}`
        await sendEmail(findUByEmail.username, email, resetLink)
    }

    static resetPassword = async({token, id: userId}) => {
        if(!token || !userId)
            throw new BadRequestError('Bad request')
        const checkTokenValid = await checkToken({token, userId})
        if(!checkTokenValid)
            throw new NotFoundError('Invalid reset token')
    }

    static changePassword = async({token, id: userId}, {password, verifyPassword}) =>{
        if(!token || !userId || !password || !verifyPassword)
            throw new BadRequestError('Bad request')
        const checkTokenValid = await checkToken({token, userId})
        if(!checkTokenValid)
            throw new BadRequestError('Bad request')
        if(!isValidPassword(password))
            throw new BadRequestError('Password must have at least 8 characters, including a number, an alphabet, and a special character')
        if(password !== verifyPassword)
            throw new BadRequestError('Password and confirmation password do not match')

        const newPassword = await bcrypt.hash(password, 10)
        if(!newPassword)
            throw new InternalServerError()

        const findUById = await findUserById({id: userId})
        if(!findUById)
            throw new NotFoundError('User not found')
        
        const updatePassword = await updateUserPassword({userId, newPassword})
        if(!updatePassword) 
            throw new ConflictError('Failed to update password')
    }
}

module.exports = UserService
