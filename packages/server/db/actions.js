const MongoAccess = require('./MongoAccess');
const {handleError} = require('../utils.js');

const COLLECTION_ACTIONS = 'actions';

/*
    ERROR CODES
**/
const ACTION_NOT_CREATED = 'ACTION_NOT_CREATED';
const ACTION_NOT_FOUND = 'ACTION_NOT_FOUND';
const ACTION_NOT_UPDATED = 'ACTION_NOT_UPDATED';
const ACTION_NOT_DELETED = 'ACTION_NOT_DELETED';
const ACTION_LOCATION_NOT_ADDED = 'ACTION_LOCATION_NOT_ADDED';
const ACTION_LOCATION_NOT_DELETED = 'ACTION_LOCATION_NOT_DELETED';
const ACTION_CLIENT_NOT_ADDED = 'ACTION_CLIENT_NOT_ADDED';
const ACTION_CLIENT_NOT_DELETED = 'ACTION_CLIENT_NOT_DELETED';
const ACTION_CATEGORY_NOT_ADDED = 'ACTION_CATEGORY_NOT_ADDED';
const ACTION_CATEGORY_NOT_DELETED = 'ACTION_CATEGORY_NOT_DELETED';

async function create(code, description, locations, clients, categories, emotions) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_ACTIONS).insertOne({
            code, description, locations, clients, categories, emotions
        });
    } catch (e) {
        return handleError(ACTION_NOT_CREATED, e);
    }
}

async function update(code, description) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        await mongo.client.collection(COLLECTION_ACTIONS).findOneAndUpdate({
            code
        }, {
            $set: {
                code, description
            }
        });
        return code;
    } catch (e) {
        return handleError(ACTION_NOT_UPDATED, e);
    }
}

async function remove(code) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        await mongo.client.collection(COLLECTION_ACTIONS).deleteOne({
            code
        });
        return code;
    } catch (e) {
        return handleError(ACTION_NOT_DELETED, e);
    }
}

async function getAll() {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_ACTIONS).find({}).toArray();
    } catch (e) {
        return handleError(ACTION_NOT_FOUND, e);
    }
}

async function getByRecognize(client, category, location, emotion) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const actions = await mongo.client.collection(COLLECTION_ACTIONS).find({}).toArray();
        return actions.reduce((acc, action) => {
            if (action.clients.some(_client => _client.code === client) &&
                action.categories.some(_category => _category.code === category) &&
                action.locations.some(_location => _location.code === location) &&
                action.emotions.some(_emotion => _emotion.code === emotion)) {
                acc = action;
            }
            return acc;
        }, {});
    } catch (e) {
        return handleError(ACTION_NOT_FOUND, e);
    }
}

async function get() {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        return await mongo.client.collection(COLLECTION_ACTIONS).findOne({});
    } catch (e) {
        return handleError(ACTION_NOT_FOUND, e);
    }
}

async function addLocation(code_action, code_location) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const current_action = await mongo.client.collection(COLLECTION_ACTIONS).findOne({code: code_action});
        await mongo.client.collection(COLLECTION_ACTIONS).findOneAndUpdate({
            code: code_action
        }, {
            $set: {
                locations: [...current_action.locations, code_location]
            }
        });
        return {
            code: code_location
        };
    } catch (e) {
        return handleError(ACTION_LOCATION_NOT_ADDED, e);
    }
}

async function removeLocation(code_action, code_location) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const action = await get(code_action);
        return await mongo.client.collection(COLLECTION_ACTIONS).updateOne({
                code: code_action
            },
            {
                $set: {
                    locations: action.locations.filter(location => location.code !== code_location)
                }
            });
    } catch (e) {
        return handleError(ACTION_LOCATION_NOT_DELETED, e);
    }
}

async function addClient(code_action, code_client) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const current_action = await mongo.client.collection(COLLECTION_ACTIONS).findOne({code: code_action});
        await mongo.client.collection(COLLECTION_ACTIONS).findOneAndUpdate({
            code: code_action
        }, {
            $set: {
                clients: [...current_action.clients, code_client]
            }
        });
        return {
            code: code_client
        };
    } catch (e) {
        return handleError(ACTION_CLIENT_NOT_ADDED, e);
    }
}

async function removeClient(code_action, code_client) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const action = await get(code_action);
        return await mongo.client.collection(COLLECTION_ACTIONS).updateOne({
                code: code_action
            },
            {
                $set: {
                    clients: action.clients.filter(client => client.code !== code_client)
                }
            });
    } catch (e) {
        return handleError(ACTION_CLIENT_NOT_DELETED, e);
    }
}

async function addCategory(code_action, code_category) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const current_action = await mongo.client.collection(COLLECTION_ACTIONS).findOne({code: code_action});
        await mongo.client.collection(COLLECTION_ACTIONS).findOneAndUpdate({
            code: code_action
        }, {
            $set: {
                categories: [...current_action.categories, code_category]
            }
        });
        return {
            code: code_category
        };
    } catch (e) {
        return handleError(ACTION_CATEGORY_NOT_ADDED, e);
    }
}

async function removeCategory(code_action, code_category) {
    const mongo = new MongoAccess();
    try {
        await mongo.connect();
        const action = await get(code_action);
        return await mongo.client.collection(COLLECTION_ACTIONS).updateOne({
                code: code_action
            },
            {
                $set: {
                    categories: action.categories.filter(category => category.code !== code_category)
                }
            });
    } catch (e) {
        return handleError(ACTION_CATEGORY_NOT_DELETED, e);
    }
}

module.exports = {
    create,
    getAll,
    update,
    remove,
    get,
    getByRecognize,
    addLocation,
    removeLocation,
    addClient,
    removeClient,
    addCategory,
    removeCategory
};
