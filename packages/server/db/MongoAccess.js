const { MongoClient } = require('mongodb');

class MongoAccess {
    constructor() {
        this.__uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
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
