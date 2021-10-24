const { mongoClient  } = require('./MongoAccess');
const {handleError} = require('../utils.js');

const COLLECTION_CLIENTS = 'clients';

/*
    ERROR CODES
**/
const CLIENT_NOT_CREATED = 'CLIENT_NOT_CREATED';
const CLIENT_NOT_FOUND = 'CLIENT_NOT_FOUND';
const CLIENT_NOT_UPDATED = 'CLIENT_NOT_UPDATED';
const CLIENT_NOT_DELETED = 'CLIENT_NOT_DELETED';

var mongo = mongo || new mongoClient();

async function create(code, name) {
    try {
        return await mongo.client.collection(COLLECTION_CLIENTS).insertOne({
            code, name
        });
    } catch (e) {
        return handleError(CLIENT_NOT_CREATED, e);
    }
}

async function update(code, name) {
    try {
        await mongo.client.collection(COLLECTION_CLIENTS).findOneAndUpdate({
            code
        },{
            $set: {
                code, name
            }
        });
        return code;
    } catch (e) {
        return handleError(CLIENT_NOT_UPDATED, e);
    }
}

async function remove(code) {
    try {
        await mongo.client.collection(COLLECTION_CLIENTS).deleteOne({
            code
        });
        return code;
    } catch (e) {
        return handleError(CLIENT_NOT_DELETED, e);
    }
}

async function getAll() {
    try {
        return await mongo.client.collection(COLLECTION_CLIENTS).find({}).toArray();
    } catch (e) {
        return handleError(CLIENT_NOT_FOUND, e);
    }
}

async function get(code) {
    try {
        return await mongo.client.collection(COLLECTION_CLIENTS).findOne({code});
    } catch (e) {
        return handleError(CLIENT_NOT_FOUND, e);
    }
}

module.exports = {create, getAll, update, remove, get};
