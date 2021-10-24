const { mongoClient  } = require('./MongoAccess');
const {handleError} = require('../utils.js');

const COLLECTION_CATEGORIES = 'categories';

/*
    ERROR CODES
**/
const CATEGORY_NOT_CREATED = 'CATEGORY_NOT_CREATED';
const CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND';
const CATEGORY_NOT_UPDATED = 'CATEGORY_NOT_UPDATED';
const CATEGORY_NOT_DELETED = 'CATEGORY_NOT_DELETED';

var mongo = mongo || new mongoClient();

async function create(code, name) {
    try {
        return await mongo.client.collection(COLLECTION_CATEGORIES).insertOne({
            code, name
        });
    } catch (e) {
        return handleError(CATEGORY_NOT_CREATED, e);
    }
}

async function update(code, name) {
    try {
        await mongo.client.collection(COLLECTION_CATEGORIES).findOneAndUpdate({
            code
        },{
            $set: {
                code, name
            }
        });
        return code;
    } catch (e) {
        return handleError(CATEGORY_NOT_UPDATED, e);
    }
}

async function remove(code) {
    try {
        await mongo.client.collection(COLLECTION_CATEGORIES).deleteOne({
            code
        });
        return code;
    } catch (e) {
        return handleError(CATEGORY_NOT_DELETED, e);
    }
}

async function getAll() {
    try {
        return await mongo.client.collection(COLLECTION_CATEGORIES).find({}).toArray();
    } catch (e) {
        return handleError(CATEGORY_NOT_FOUND, e);
    }
}

async function get(code) {
    try {
        return await mongo.client.collection(COLLECTION_CATEGORIES).findOne({code});
    } catch (e) {
        return handleError(CATEGORY_NOT_FOUND, e);
    }
}

module.exports = {create, getAll, update, remove, get};
