'use strict'

const mongoose = require('mongoose')
const {db: {host, port, name}} = require('../configs/db.config')
const mongoURI = `mongodb://${host}:${port}/${name}`
class Database{
    constructor(){
        this.connect()
    }

    connect(type = 'Mongodb'){
        if(true){
            mongoose.set('debug', true)
        }

        mongoose.connect(mongoURI)
        .then(() => {
            console.log(`+ Successfully connected to ${type}`)
        })
        .catch((error) => {
            console.log(`+ Error connecting to ${type}:`, error)
        })
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instance = Database.getInstance()
module.exports = instance