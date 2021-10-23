const {ruleDB} = require('../db');
const {res} = require('../utils');

const RULE_CREATED = 'RULE_CREATED';
const RULES_FOUND = 'RULES_FOUND';
const RULE_DELETED = 'RULE_DELETED';

const createRule = async (request, response) => {
    const {keywords, tag, lang} = request.body;
    try {
        const match = await ruleDB.create(keywords, tag, lang);
        res(match, match, RULE_CREATED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteRule = async (request, response) => {
    const {id} = request.params;
    try {
        const match = await ruleDB.remove(id);
        res(match, id, RULE_DELETED, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

const getRules = async (request, response) => {
    try {
        const match = await ruleDB.getAll();
        res(match, match, RULES_FOUND, response);
    } catch (e) {
        response.status(500).json(e);
    }
};

module.exports = {
    createRule,
    getRules,
    deleteRule
};
