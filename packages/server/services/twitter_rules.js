const {ruleDB} = require('../db');
const {res} = require('../utils');

const RULE_CREATED = 'RULE_CREATED';
const RULES_FOUND = 'RULES_FOUND';
const RULE_DELETED = 'RULE_DELETED';

const createRule = async (request, response) => {
    const {keywords, tag, lang} = request.body;
    const keywordsArray = keywords.replace(/ /g,'').split(',');
    try {
        const match = await ruleDB.create(keywordsArray, tag, lang);
        response.status(200).json({
            message: RULE_CREATED,
            data: match.data
        });
    } catch (e) {
        response.status(500).json(e);
    }
};

const deleteRule = async (request, response) => {
    const {id} = request.params;
    try {
        const match = await ruleDB.remove(id);
        response.status(200).json({
            message: RULE_DELETED,
            data: match.data
        });
    } catch (e) {
        response.status(500).json(e);
    }
};

const getRules = async (request, response) => {
    try {
        const match = await ruleDB.getAll();
        response.status(200).json({
            message: RULES_FOUND,
            data: match.data
        });
    } catch (e) {
        response.status(500).json(e);
    }
};

module.exports = {
    createRule,
    getRules,
    deleteRule
};
