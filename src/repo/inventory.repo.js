'use strict'

const inventoryModel = require("../models/inventory.model")


const findInventoryByShopId = async(userId) => {
    return await inventoryModel.findOne({
        invent_shopId: userId
    })
}

const createInventory = async(product, userId) => {
    return await inventoryModel.create({
        invent_shopId: userId,
        invent_products: [product]
    })
}

const findProductInInventory = async(productId, invent) => {
    return await invent.invent_products.find(product => product._id.toString() === productId.toString() )
}

const addProductToInvent = async(userId, product) => {
    const query = {invent_shopId: userId}
        const update = {
            $addToSet: {
                invent_products: product
            }
        }, options = {upsert: true, new: true}
    return await inventoryModel.updateOne(query, update, options)
}

const updateShopInvent = async(userId, product) => {
    const {_id: productId, product_quantity} = product
        const query = {
            invent_shopId: userId, 
            'invent_products._id': productId,
        }, update = {
            $inc: {
                'invent_products.$.product_quantity': product_quantity
            }
        }, options = {upsert: true, new: true}
        return await inventoryModel.findOneAndUpdate(query, update, options)
}

const updateProductInvent = async(updateProduct, invent) => {
    return await inventoryModel.updateOne(
         { _id: invent._id, "invent_products._id": updateProduct._id },
         { $set: {
            'invent_products.$[elem]': {...updateProduct}
        } },
         {arrayFilters: [{ "elem._id": updateProduct._id }]}
    );
}

const deleteProductInInvent = async(invent, productId) => {
    const query = {
        _id: invent._id
    }, update = {
        $pull: {
            invent_products: {
                _id: productId
            }
        }
    }, options = {}
    return await inventoryModel.updateOne(query, update, options)      
}

module.exports = {
    findInventoryByShopId,
    createInventory,
    findProductInInventory,
    addProductToInvent,
    updateShopInvent,
    deleteProductInInvent,
    updateProductInvent
}