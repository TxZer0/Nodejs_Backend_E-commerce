'use strict'

const { findCartById, findCartByUserId, updateUserCart, addToUserCart, deleteCartById, listAllProductByUserId, findProductInCart, deleteItemById, deleteCartByUserId } = require("../repo/cart.repo")
const { findProductById } = require("../repo/product.repo")
const { findUserById } = require("../repo/user.repo")
const { NotFoundError, BadRequestError, ConflictRequestError } = require("../responses/error.response")

class CartService{
    static addToCart = async({userId}, product = {}) => {
        const findProduct = await findProductById(product._id)
        if(!findProduct)
            throw new NotFoundError('Product not found')
        const checkCart = await findCartByUserId(userId);   
        if(checkCart){
            const checkProduct = await findProductInCart(product._id, checkCart)
            if(checkProduct)
                return await updateUserCart(userId, product)
        }    
        const addProduct = await addToUserCart(userId, product)
        if(!addProduct)
            throw new ConflictRequestError('Failed to add item')
    }

    static deleteItem = async({userId}, productId) => {
        const findCart = await findCartByUserId(userId)
        if(!findCart)
            throw new NotFoundError('Cart not found')
        const findProduct = await findProductInCart(productId, findCart)
        if(!findProduct)
            throw new NotFoundError('Product not found in cart')
        const delItem = await deleteItemById(userId, productId)
        if(!delItem)
            throw new ConflictError('Failed to delete item')
    }

    static deleteCart = async({userId}) => {
        const findCart = await findCartByUserId(userId)
        if(!findCart)
            throw new NotFoundError('Cart not found')
        const delItem = await deleteCartByUserId(userId)
        if(!delItem)
            throw new ConflictError('Failed to delete cart')
    }

    static listAllProduct = async({userId}) => {
        return await listAllProductByUserId(userId)
    }

    static reviewBillInfomation = async(product = []) => {
        const detailedItems = []
        let totalOrder = product.reduce((acc, product) => {
        const itemTotal = product.product_quantity * product.product_price    
        detailedItems.push({
            productName: product.product_name,
            price: product.product_price,
            quantity: product.product_quantity,
            total: itemTotal
        }) 
        return acc + itemTotal
        }, 0) 
        return {
            items: detailedItems,
            totalAmount: totalOrder
        }
    }
}

module.exports = CartService