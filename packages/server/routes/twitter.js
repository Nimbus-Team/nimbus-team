const express = require('express');
const router = express.Router();
const Twitter = require('twitter-v2');
const dotenv = require('dotenv');
dotenv.config();

const client = new Twitter({
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

router.get('/stream', async (request, response, next) => {
    const stream = client.stream('tweets/search/stream', {
        'user.fields': 'username,location',
        'tweet.fields': 'created_at',
        'place.fields': 'country,country_code,place_type',
        expansions: 'author_id'
    });

    const buffer = [];

    setTimeout(() => {
        stream.close();
    }, Number(process.env.STREAM_LISTENING_TIME) || 30000);

    for await (const {data: tweet, includes, matching_rules: rules} of stream) {
        buffer.push({
            tweet, users: includes.users, rules
        });
    }

    response.status(200).json(buffer);
});

module.exports = router;
