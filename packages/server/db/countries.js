const MongoAccess = require('./MongoAccess');
const {handleError} = require('../utils.js');

const COLLECTION_COUNTRIES = 'countries';

/*
    ERROR CODES
**/
const COUNTRY_NOT_CREATED = 'COUNTRY_NOT_CREATED';
const COUNTRY_NOT_FOUND = 'COUNTRY_NOT_FOUND';
const COUNTRY_NOT_UPDATED = 'COUNTRY_NOT_UPDATED';
const COUNTRY_NOT_ADDED_LABEL = 'COUNTRY_NOT_ADDED_LABEL';
const COUNTRY_NOT_DELETED_LABEL = 'COUNTRY_NOT_DELETED_LABEL';
const COUNTRY_NOT_DELETED = 'COUNTRY_NOT_DELETED';

async function create(code, name, lang, locations) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_COUNTRIES).insertOne({
            code, name, lang, locations
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
        }, {
            $set: {
                code, name, lang
            }
        });
        return code;
    } catch (e) {
        return handleError(COUNTRY_NOT_UPDATED, e);
    }
}

async function addLocationLabel(code, label) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const current_country = await get(code);
        await mongo.client.collection(COLLECTION_COUNTRIES).findOneAndUpdate({
            code
        }, {
            $set: {
                locations: [...current_country.locations, label]
            }
        });
        return code;
    } catch (e) {
        return handleError(COUNTRY_NOT_ADDED_LABEL, e);
    }
}

async function removeLocationLabel(code, label) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const current_country = await get(code);
        await mongo.client.collection(COLLECTION_COUNTRIES).findOneAndUpdate({
            code
        }, {
            $set: {
                locations: [...current_country.locations.filter(location => location !== label)]
            }
        });
        return code;
    } catch (e) {
        return handleError(COUNTRY_NOT_DELETED_LABEL, e);
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

async function get(code) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_COUNTRIES).findOne({code});
    } catch (e) {
        return handleError(COUNTRY_NOT_FOUND, e);
    }
}

module.exports = {create, getAll, update, remove, get, addLocationLabel, removeLocationLabel};
