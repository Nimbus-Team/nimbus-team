const {actionDB} = require('../db');
const {res} = require('../utils');

const ACTION_CREATED = 'ACTION_CREATED';
const ACTION_FOUND = 'ACTION_FOUND';
const ACTION_UPDATED = 'ACTION_UPDATED';
const ACTION_DELETED = 'ACTION_DELETED';

const createAction = async (request, response) => {
    const {code, description, locations, clients, categories, emotions} = request.body;
    try {
        const match = await actionDB.create(code, description, locations, clients, categories, emotions);
        res(match, await actionDB.get(code), ACTION_CREATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const updateAction = async (request, response) => {
    const {code} = request.params;
    let {description} = request.body;

    try {
        const current_action = await actionDB.get(code);
        if(!description) {
            description = current_action.description;
        }
        const match = await actionDB.update(code, description);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteAction = async (request, response) => {
    const {code} = request.params;
    try {
        const match = await actionDB.remove(code);
        res(match, code, ACTION_DELETED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const getActions = async (request, response) => {
    try {
        const match = await actionDB.getAll();
        res(match, match, ACTION_FOUND, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const addLocation = async (request, response) => {
    const {code} = request.params;
    const {location} = request.body;

    try {
        const match = await actionDB.addLocation(code, location);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const removeLocation = async (request, response) => {
    const {code} = request.params;
    const {location} = request.body;

    try {
        const match = await actionDB.removeLocation(code, location);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const addClient = async (request, response) => {
    const {code} = request.params;
    const {client} = request.body;

    try {
        const match = await actionDB.addClient(code, client);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const removeClient = async (request, response) => {
    const {code} = request.params;
    const {client} = request.body;

    try {
        const match = await actionDB.removeClient(code, client);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const addCategory = async (request, response) => {
    const {code} = request.params;
    const {category} = request.body;

    try {
        const match = await actionDB.addCategory(code, category);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const removeCategory = async (request, response) => {
    const {code} = request.params;
    const {category} = request.body;

    try {
        const match = await actionDB.removeCategory(code, category);
        res(match, code, ACTION_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

module.exports = {
    createAction,
    getActions,
    updateAction,
    deleteAction,
    addCategory,
    addClient,
    addLocation,
    removeCategory,
    removeClient,
    removeLocation
};
