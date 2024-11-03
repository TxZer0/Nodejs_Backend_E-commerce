'use strict'

const { SuccessResponse, CREATED } = require("../responses/success.response")
const ProductService = require("../services/product.service")

class ProductController{
    static searchProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Success',
            metadata: await ProductService.searchProduct(req.params.productName)
        }).send(res)
    }

    static createProduct = async(req, res) => {
        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body, req.user)
        }).send(res)
    }

    static deleteProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Product deleted successfully',
            metadata: await ProductService.deleteProduct(req.params.productId, req.user)
        }).send(res)
    }

    static updateProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Product updated successfully',
            metadata: await ProductService.updateProduct(req.params.productId, req.user, req.body)
        }).send(res)
    }

    static publishProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Product published successfully',
            metadata: await ProductService.publishProduct(req.params.productId, req.user)
        }).send(res)
    }

    static unPublishProduct = async(req, res) => {
        new SuccessResponse({
            message: 'Product unpublished successfully',
            metadata: await ProductService.unPublishProduct(req.params.productId, req.user)
        }).send(res)
    }

    static listAllPublishProduct = async(req, res) => {
        new SuccessResponse({
            message: 'All published products listed successfully',
            metadata: await ProductService.listAllPublishProduct(req.user)
        }).send(res)
    }

    static listAllUnPublishProduct = async(req, res) => {
        new SuccessResponse({
            message: 'All unpublished products listed successfully',
            metadata: await ProductService.listAllUnPublishProduct(req.user)
        }).send(res)
    }
}

module.exports = ProductController