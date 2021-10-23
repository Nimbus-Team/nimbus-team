const {categoryDB} = require('../db');
const {res} = require('../utils');

const CLIENT_CREATED = 'CLIENT_CREATED';
const CLIENT_FOUND = 'CLIENT_FOUND';
const CLIENT_UPDATED = 'CLIENT_UPDATED';
const CLIENT_DELETED = 'CLIENT_DELETED';

const createClient = async (request, response) => {
    const {code, name} = request.body;
    try {
        const match = await categoryDB.create(code, name);
        res(match, await categoryDB.get(code), CLIENT_CREATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const updateClient = async (request, response) => {
    const {code} = request.params;
    let {name} = request.body;

    try {
        const current_client = await categoryDB.get(code);
        if(!name) {
            name = current_client.name;
        }
        const match = await categoryDB.update(code, name);
        res(match, code, CLIENT_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteClient = async (request, response) => {
    const {code} = request.params;
    try {
        const match = await categoryDB.remove(code);
        res(match, code, CLIENT_DELETED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const getClients = async (request, response) => {
    try {
        const match = await categoryDB.getAll();
        res(match, match, CLIENT_FOUND, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient
};
