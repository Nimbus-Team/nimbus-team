
const { v4 } = require('uuid');
const {clientDB} = require('../db');
const {res} = require('../utils');

const CLIENT_CREATED = 'CLIENT_CREATED';
const CLIENT_FOUND = 'CLIENT_FOUND';
const CLIENT_UPDATED = 'CLIENT_UPDATED';
const CLIENT_DELETED = 'CLIENT_DELETED';

const createClient = async (request, response) => {
    const {name} = request.body;
    const code = v4();
    try {
        const match = await clientDB.create(code, name);
        res(match, await clientDB.get(code), CLIENT_CREATED, response);
        ;
    } catch (e) {
        response.status(500).json(e);
    }
};

const updateClient = async (request, response) => {
    const {code} = request.params;
    let {name} = request.body;

    try {
        const current_client = await clientDB.get(code);
        if(!name) {
            name = current_client.name;
        }
        const match = await clientDB.update(code, name);
        res(match, code, CLIENT_UPDATED, response);
        ;
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteClient = async (request, response) => {
    const {code} = request.params;
    try {
        const match = await clientDB.remove(code);
        res(match, code, CLIENT_DELETED, response);
        ;
    } catch (e) {
        response.status(500).json(e);
    }
};

const getClients = async (request, response) => {
    try {
        const match = await clientDB.getAll();
        res(match, match, CLIENT_FOUND, response);
        ;
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
