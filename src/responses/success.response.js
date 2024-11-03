'use strict'

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

class SuccessResponse{
    constructor({message, status = StatusCodes.OK, reason = ReasonPhrases.OK , metadata = {}}){
        this.message = message ? message: reason
        this.status = status
        this.metadata = metadata
    }

    send(res){
        return res.status(this.status).json(this)
    }
}
class CREATED extends SuccessResponse{
    constructor({message, status = StatusCodes.CREATED, reason = ReasonPhrases.CREATED, metadata}){
        super({message, status, reason, metadata})
    }
}

module.exports = {
    CREATED,
    SuccessResponse
}