const MongoAccess = require('./MongoAccess');
const {handleError} = require('../utils.js');

const COLLECTION_COUNTRIES = 'countries';

/*
    ERROR CODES
**/
const COUNTRY_NOT_CREATED = 'COUNTRY_NOT_CREATED';
const COUNTRY_NOT_FOUND = 'COUNTRY_NOT_FOUND';
const COUNTRY_NOT_UPDATED = 'COUNTRY_NOT_UPDATED';
const COUNTRY_NOT_DELETED = 'COUNTRY_NOT_DELETED';

async function create(code, name, lang) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_COUNTRIES).insertOne({
            code, name, lang
        });
    } catch (e) {
        return handleError(COUNTRY_NOT_CREATED, e);
    }
}

async function update(code, name, lang) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        await mongo.client.collection(COLLECTION_COUNTRIES).findOneAndUpdate({
            code
        },{
            $set: {
                code, name, lang
            }
        });
        return code;
    } catch (e) {
        return handleError(COUNTRY_NOT_UPDATED, e);
    }
}

async function remove(code) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        await mongo.client.collection(COLLECTION_COUNTRIES).deleteOne({
            code
        });
        return code;
    } catch (e) {
        return handleError(COUNTRY_NOT_DELETED, e);
    }
}

async function getAll() {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_COUNTRIES).find({}).toArray();
    } catch (e) {
        return handleError(COUNTRY_NOT_FOUND, e);
    }
}

async function get() {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_COUNTRIES).findOne({});
    } catch (e) {
        return handleError(COUNTRY_NOT_FOUND, e);
    }
}

module.exports = {create, getAll, update, remove, get};
