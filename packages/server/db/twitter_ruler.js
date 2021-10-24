const {handleError} = require('../utils.js');
const axios = require('axios');

const ENDPOINT = 'tweets/search/stream/rules';

/*
    ERROR CODES
**/
const TWITTER_RULE_NOT_CREATED = 'TWITTER_RULE_NOT_CREATED';
const TWITTER_RULE_NOT_FOUND = 'TWITTER_RULE_NOT_FOUND';
const TWITTER_RULE_NOT_DELETED = 'TWITTER_RULE_NOT_DELETED';

async function create(keywords, tag, lang = 'es') {
    try {
        return await axios.post('https://api.twitter.com/2/' + ENDPOINT, {
            add: [
                {
                    value: `(${keywords.join()}) lang:${lang}`, tag
                }
            ]
        }, {
            headers: {'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`}
        });
    } catch (e) {
        return handleError(TWITTER_RULE_NOT_CREATED, e);
    }
}

async function remove(code) {
    try {
        return await axios.post('https://api.twitter.com/2/tweets/search/stream/rules', {
            delete: [
                {
                    ids: [code]
                }
            ]
        }, {
            headers: {'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`}
        });
    } catch (e) {
        return handleError(TWITTER_RULE_NOT_DELETED, e);
    }
}

async function getAll() {
    try {
        return await axios.get('https://api.twitter.com/2/tweets/search/stream/rules',  {
            headers: {'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`}
        });
    } catch (e) {
        return handleError(TWITTER_RULE_NOT_FOUND, e);
    }
}

module.exports = {create, getAll, remove};
