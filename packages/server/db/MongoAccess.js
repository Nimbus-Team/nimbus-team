const { MongoClient } = require('mongodb');

class MongoAccess {
    constructor() {
        this.__uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
        this.mongo = new MongoClient(this.__uri);
        this.connect();
    }

    async connect() {
      console.log('Connecting to MongoDB...');
      await this.mongo.connect();
    }

    async close() {
      console.log('Closing to MongoDB...');
      await this.mongo.close();
    }

    get client() {
        return this.mongo.db(process.env.MONGO_DB);
    }
}

module.exports = {
  mongoClient: MongoAccess
};
