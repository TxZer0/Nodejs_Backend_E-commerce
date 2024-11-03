const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const route = require('./routes')
const {ReasonPhrases, StatusCodes} = require('./utils/httpStatusCode')
require('dotenv').config()


//init middleware
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PATCH'
}))

//init database
require('./dbs/init.db')

//init route
app.use('/', route)

//handle error
app.use((error, req, res, next) => {
    const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(statusCode).json({
        code: statusCode,
        message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    })
})

module.exports = app