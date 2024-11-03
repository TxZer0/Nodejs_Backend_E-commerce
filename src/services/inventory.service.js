'use strict'

const { findInventoryByShopId, createInventory, findProductInInventory, updateShopInvent, deleteProductInInvent, updateProductInvent, addProductToInvent } = require("../repo/inventory.repo")
const { ConflictRequestError, NotFoundError } = require("../responses/error.response")

class InventoryService{
    static addToInvent = async(product, userId) => {
        const findInvent = await findInventoryByShopId(userId)
        if(!findInvent){
            const newInvent = await createInventory(product, userId)
            if(!newInvent)
                throw new ConflictRequestError('create failed')     
        }else{
            const findProduct = await findProductInInventory(product._id, findInvent)
            if(!findProduct){
                const addProduct = await addProductToInvent(userId, product)
                if(!addProduct)
                    throw new ConflictRequestError('create failed')
        }
        return true
        }
    }
    static deleteProductInvent = async(product, userId) => {
        const findInvent = await findInventoryByShopId(userId)
        if(!findInvent)
            throw new NotFoundError('Not found product in inventory')
        return await deleteProductInInvent(findInvent, product._id)
    }

    static updateProductInvent = async(updateProduct, userId) => {
        const findInvent = await findInventoryByShopId(userId)
        if(!findInvent)
            throw new NotFoundError('Not found product in inventory')
        return await updateProductInvent(updateProduct, findInvent) 
    }
}

module.exports = InventoryService