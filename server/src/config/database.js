const mongoose = require('mongoose')
const { env } = require('./constants')

class Database {
    constructor() {
        if (Database.instance) return Database.instance
        Database.instance = this
        this.connect()
    }
    async connect() {
        try {
            mongoose.set('debug', true)
            await mongoose.connect(env.MONGO_URI, { maxPoolSize: 50 })
            console.log(
                `✅ Connected MongoDb Success::${mongoose.connection.db.databaseName}`,
            )
        } catch (error) {
            console.error('❌ Disconnected MongoDb', error.message)
        }
    }
}

const instanceDb = new Database()
module.exports = instanceDb
