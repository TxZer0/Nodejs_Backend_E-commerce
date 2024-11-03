'use strict'

const userModel = require("../models/user.model")
const {updateProductById, findProduct, createProduct, findProductById, deleteProduct, publishProductById, unPublishProductById, findPublishProduct, findUnPublishProduct, updateProductPublishStatus } = require("../repo/product.repo")
const removeAccents = require('remove-accents');
const { NotFoundError, BadRequestError, ConflictRequestError, InternalServerError } = require("../responses/error.response");
const { removeUndefinedOrNullProperties, pickProperties, omitProperties, convertStringToObjectId } = require("../utils");
const InventoryService = require("./inventory.service");
class ProductService{
    static searchProduct = async(productName) => {
        const searchKey = new RegExp(removeAccents(productName), 'i')
        const query = {
            isPublished: true,
            $text: {
                $search: searchKey
            }
        }, projectionType = {
            score: { $meta: "textScore" },
            _id: 0, __v: 0
        }
        const result = await findProduct(query, projectionType)
        if(!result) {
            throw new NotFoundError('No products found')  
        }
        return {
            result
        }
    }

    static createProduct = async(product, {userId}) => {
        const newProduct = await createProduct(product, userId)
        if(!newProduct)
            throw new BadRequestError('Product creation failed')
        const newInvent = await InventoryService.addToInvent(newProduct, userId)
        if(!newInvent)
            throw new InternalServerError('Product creation failed')
        return {
            product: omitProperties({object: newProduct, props: ['__v']})
        }

    }

    static deleteProduct = async(productId, {userId}) => {
        const findProduct = await findProductById(productId)
        if(!findProduct)
            throw new NotFoundError('Product not found')
        if(!convertStringToObjectId(userId).equals(findProduct.product_shop))
            throw new ForbiddenError('No permission')

        const newInvent = await InventoryService.deleteProductInvent(findProduct, userId)
        if(!newInvent)
            throw new InternalServerError('Failed to delete product')

        const delProduct = await deleteProduct(productId)   
        if(!delProduct)
            throw new ConflictRequestError('Failed to delete product')
        
    }

    static updateProduct = async(productId, {userId}, product) => {
        const findProduct = await findProductById(productId)
        if(!findProduct)
            throw new NotFoundError('Product not found')
        if(!convertStringToObjectId(userId).equals(findProduct.product_shop))
            throw new ForbiddenError('No permission')
        const deleteNullFields = removeUndefinedOrNullProperties(product)
        const updateProduct = await updateProductById(
            productId, 
            deleteNullFields
        )
        if(!updateProduct) 
            throw new ConflictError('Update failed')

        const updateInvent = await InventoryService.updateProductInvent(updateProduct, userId)
        if(!updateInvent) 
            throw new ConflictRequestError('Update failed')

        return {
            product: omitProperties({object: updateProduct, props: ['__v']})
        }
    }

    static publishProduct = async(productId, {userId}) => {
        const findProduct = await findProductById(productId)
        if(!findProduct)
            throw new NotFoundError('Product not found')
        if(!convertStringToObjectId(userId).equals(findProduct.product_shop))
            throw new ForbiddenError('No permission')
        const publishProduct = await updateProductPublishStatus(productId)
        if(!publishProduct) 
            throw new ConflictRequestError('Publish operation failed')
        return {
            product: omitProperties({object: publishProduct, props: ['__v']})
        }
    }

    static unPublishProduct = async(productId, {userId}) => {
        const findProduct = await findProductById(productId)
        if(!findProduct)
            throw new NotFoundError('Product not found')
        if(!convertStringToObjectId(userId).equals(findProduct.product_shop))
            throw new ForbiddenError('No permission')
        const unPublishProduct = await updateProductPublishStatus(productId, false)
        if(!unPublishProduct) 
            throw new ConflictRequestError('Publish operation failed')
        return {
            product: omitProperties({object: unPublishProduct, props: ['__v']})
        }
    }

    static listAllPublishProduct = async({userId}) => {
        const findProduct = await findPublishProduct(userId)
        if(!findProduct)
            throw new NotFoundError('Not found')
        return findProduct
    }

    static listAllUnPublishProduct = async({userId}) => {
        const findProduct = await findUnPublishProduct(userId)
        if(!findProduct)
            throw new NotFoundError('Not found')
        return findProduct
    }
}

module.exports = ProductService