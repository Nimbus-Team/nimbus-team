const { MongoClient } = require('mongodb');

class MongoAccess {
    constructor() {
        this.__uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.t40mh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
        this.mongo = new MongoClient(this.__uri);
    }

    async connect() {
        await this.mongo.connect();
    }

    get client() {
        return this.mongo.db(process.env.MONGO_DB);
    }
}

module.exports = MongoAccess;
