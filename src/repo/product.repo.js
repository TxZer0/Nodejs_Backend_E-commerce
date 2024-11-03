'use strict'

const productModel = require("../models/product.model")
const removeAccents = require('remove-accents')
const findProduct = async(query, projectionType) => {
    return await productModel.find(query, projectionType).lean()
}

const findProductById = async(productId) => {
    return await productModel.findOne({
        _id: productId
    })
}

const createProduct = async(product, userId) => {
    return await productModel.create({
        product_name: product.product_name, 
        product_name_no_diacritics: removeAccents(product.product_name), 
        product_price: product.product_price,
        product_description: product.product_description, 
        product_shop: userId, 
        product_type: product.product_type, 
        product_attribute: product.product_attribute,
        product_quantity: product.product_quantity, 
        product_brand: product.product_brand, 
    })
}

const findPublishProduct = async(userId) => {
    return await productModel.find({
        product_shop: userId,
        isPublished: true
    })
    
}

const findUnPublishProduct = async(userId) => {
    return await productModel.find({
        product_shop: userId,
        isPublished: false
    })
    
}

const updateProductById = async(productId, product, model = productModel) => {
    return await model.findByIdAndUpdate(
        productId,
        { $set: product },
        { new: true}
    ).lean()
}

const deleteProduct = async(productId) => {
    return await productModel.deleteOne({
        _id: productId
    })
}

const updateProductPublishStatus  = async(productId, isPublished = true) => {
    const filter = {
        _id: productId
    }, update = {
        $set : {
            isPublished: isPublished
        }
    }, options = {new: true, fields: { _id: 0, __v: 0 }}
    return await productModel.findByIdAndUpdate(filter, update, options)
}


module.exports =  {
    findProductById,
    findProduct,
    createProduct,
    deleteProduct,
    updateProductPublishStatus,
    findPublishProduct,
    findUnPublishProduct,
    updateProductById
}