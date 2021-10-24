
const {countryDB} = require('../db');
const {res} = require('../utils');

const COUNTRY_CREATED = 'COUNTRY_CREATED';
const COUNTRY_FOUND = 'COUNTRY_FOUND';
const COUNTRY_UPDATED = 'COUNTRY_UPDATED';
const COUNTRY_DELETED = 'COUNTRY_DELETED';

const createCountry = async (request, response) => {
    const {code, name, lang, locations} = request.body;
    const locationsParsed = locations.replace(/ /g, '').split(',')
    try {
        const match = await countryDB.create(code, name, lang, locationsParsed);
        res(match, await countryDB.get(code), COUNTRY_CREATED, response);
        
    } catch (e) {
        response.status(500).json(e);
    }
};

const updateCountry = async (request, response) => {
    const {code} = request.params;
    let {name, lang} = request.body;

    try {
        const current_country = await countryDB.get(code);
        if(!name) {
            name = current_country.name;
        }
        if(!lang) {
            lang = current_country.lang;
        }
        const match = await countryDB.update(code, name, lang);
        res(match, code, COUNTRY_UPDATED, response);
        
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteCountry = async (request, response) => {
    const {code} = request.params;
    try {
        const match = await countryDB.remove(code);
        res(match, code, COUNTRY_DELETED, response);
        
    } catch (e) {
        response.status(500).json(e);
    }
};

const getCountries = async (request, response) => {
    try {
        const match = await countryDB.getAll();
        res(match, match, COUNTRY_FOUND, response);
        
    } catch (e) {
        response.status(500).json(e);
    }
};

module.exports = {
    createCountry,
    getCountries,
    updateCountry,
    deleteCountry
};
