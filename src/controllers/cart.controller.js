'use strict'

const { CREATED, SuccessResponse } = require("../responses/success.response")
const CartService = require("../services/cart.service")

class CartController{
    static addToCart = async(req, res) => {
        new CREATED({
            message: 'Item added to cart successfully',
            metadata: await CartService.addToCart(req.user, req.body)
        }).send(res)
    }

    static deleteItem = async(req, res) => {
        new SuccessResponse({
            message: 'Item deleted from cart successfully',
            metadata: await CartService.deleteItem(req.user, req.params.productId)
        }).send(res)
    }

    static deleteCart = async(req, res) => {
        new SuccessResponse({
            message: 'Cart cleared successfully',
            metadata: await CartService.deleteCart(req.user)
        }).send(res)
    }

    static listAllProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Products listed successfully',
            metadata: await CartService.listAllProduct(req.user)
        }).send(res)
    }

    static reviewBillInfomation = async(req, res) => {
        new SuccessResponse({
            message: 'Invoice information before payment',
            metadata: await CartService.reviewBillInfomation(req.body)
        }).send(res)
    }
}

module.exports = CartController