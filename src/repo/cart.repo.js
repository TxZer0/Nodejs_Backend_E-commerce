'use strict'

const cartModel = require("../models/cart.model")

const findCartByUserId = async(userId) => {
    return await cartModel.findOne({
        cart_userId: userId
    }).lean()
}


const updateUserCart = async(userId, product) => {
    const {_id: productId, product_quantity} = product
        const query = {
            cart_userId: userId, 
            'cart_products._id': productId,
        }, update = {
            $inc: {
                'cart_products.$.product_quantity': product_quantity
            }
        }, options = {upsert: true, new: true}
        return await cartModel.findOneAndUpdate(query, update, options)
}

const addToUserCart = async(userId, product = {}) => {
    const query = {cart_userId: userId}
        const update = {
            $addToSet: {
                cart_products: product
            }
        }, options = {upsert: true, new: true}
    return await cartModel.updateOne(query, update, options)
}

const findProductInCart = async(productId, cart) => {
    return await cart.cart_products.find(product => product._id.toString() === productId.toString() )
} 

const deleteItemById = async(userId, productId) => {
    const query = {
        cart_userId: userId
    }, update = {
        $pull: {
            cart_products: {
                _id: productId
            }
        }
    }, options = {}
    return await cartModel.updateOne(query, update, options)      
}

const deleteCartByUserId = async(userId) => {
    return await cartModel.deleteOne({
        cart_userId: userId
    }).lean()
}

const listAllProductByUserId = async(userId) => {
    return await cartModel.find({
        cart_userId: userId
    }).lean()
}
module.exports = {
    findCartByUserId,
    updateUserCart,
    addToUserCart,
    deleteItemById,
    deleteCartByUserId,
    listAllProductByUserId,
    findProductInCart
}