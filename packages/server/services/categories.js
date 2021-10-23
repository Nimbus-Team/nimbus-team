const {categoryDB} = require('../db');
const {res} = require('../utils');

const CATEGORY_CREATED = 'CATEGORY_CREATED';
const CATEGORY_FOUND = 'CATEGORY_FOUND';
const CATEGORY_UPDATED = 'CATEGORY_UPDATED';
const CATEGORY_DELETED = 'CATEGORY_DELETED';

const createCategory = async (request, response) => {
    const {code, name} = request.body;
    try {
        const match = await categoryDB.create(code, name);
        res(match, await categoryDB.get(code), CATEGORY_CREATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const updateCategory = async (request, response) => {
    const {code} = request.params;
    let {name} = request.body;

    try {
        const current_category = await categoryDB.get(code);
        if(!name) {
            name = current_category.name;
        }
        const match = await categoryDB.update(code, name);
        res(match, code, CATEGORY_UPDATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteCategory = async (request, response) => {
    const {code} = request.params;
    try {
        const match = await categoryDB.remove(code);
        res(match, code, CATEGORY_DELETED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const getCategories = async (request, response) => {
    try {
        const match = await categoryDB.getAll();
        res(match, match, CATEGORY_FOUND, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};
