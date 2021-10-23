require('dotenv').config();

const express = require('express');

const Twitter = require('twitter-v2');

const client = new Twitter({
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST", "OPTIONS"]
    }
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));

server.listen(process.env.PORT, () => console.log(`Node server listening on port ${process.env.PORT}!`));

// Streaming

io.on('connection', async (socket) => {
    console.log('connected!');

    socket.on('request-suggestion', async (country_code) => {
        console.log(`Requesting suggestion for ${country_code} at ${new Date()}`);

        const _tweetsBuffer = [];

        const countries = new Map([
            ['mx', 'México'],
            ['co', 'Colombia'],
            ['es', 'España'],
            ['pe', 'Perú'],
            ['ar', 'Argentina'],
            ['ve', 'Venezuela']
        ]);

        const categories = [
            'financial_health_person',
            'transition_sustainable_future_person',
            'grow_clients_person',
            'excellency_operation_person',
        ];

        const actions = new Map([
            ['mx', new Map([
                ['financial_health_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['transition_sustainable_future_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['grow_clients_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['excellency_operation_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]]
            ])],
            ['co', new Map([
                ['financial_health_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['transition_sustainable_future_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['grow_clients_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['excellency_operation_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]]
            ])],
            ['es', new Map([
                ['financial_health_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['transition_sustainable_future_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['grow_clients_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['excellency_operation_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]]
            ])],
            ['pe', new Map([
                ['financial_health_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['transition_sustainable_future_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['grow_clients_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['excellency_operation_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]]
            ])],
            ['ar', new Map([
                ['financial_health_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['transition_sustainable_future_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['grow_clients_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['excellency_operation_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]]
            ])],
            ['ve', new Map([
                ['financial_health_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['transition_sustainable_future_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['grow_clients_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]],
                ['excellency_operation_person', [
                    'Línea de crédito para carros eléctricos',
                    'Congelar intereses durante 3 meses',
                    'Doble de puntos BBVA en compras en línea'
                ]]
            ])]
        ]);

        const stream = client.stream('tweets/search/stream', {
            'user.fields': 'username,location',
            'tweet.fields': 'created_at',
            'place.fields': 'country,country_code,place_type',
            expansions: 'author_id'
        });

        setTimeout(() => {
            stream.close();
        }, Number(process.env.STREAM_LISTENING_TIME) || 30000);

        for await (const {data: tweet, includes, matching_rules: rules} of stream) {
            const _itemTweet = {
                tweet, rules, users: includes.users
            };
            _tweetsBuffer.push(_itemTweet);
            socket.emit('tweet', _itemTweet);
        }

        // TODO Analyze data

        const _suggestions = new Map();

        for (const category of categories) {
            _suggestions.set(category, {
                action: actions.get(country_code.toLowerCase()).get(category)[1],
                emotions: [],
                tweets: _tweetsBuffer.filter(item => item.rules.some(rule => rule.tag === category))
            });
        }

        /*const suggestions = new Map([
            ['financial_health_person', {
                action: actions.get(country_code.toLowerCase()).get('financial_health_person')[1],
                emotions: [],
                tweets: _tweetsBuffer.filter(item => item.rules.some(rule => rule.tag === 'financial_health_person'))
            }],
            ['transition_sustainable_future_person', {
                action: actions.get(country_code.toLowerCase()).get('transition_sustainable_future_person')[1],
                emotions: [],
                tweets: _tweetsBuffer.filter(item => item.rules.some(rule => rule.tag === 'transition_sustainable_future_person'))
            }],
            ['grow_clients_person', {
                action: actions.get(country_code.toLowerCase()).get('grow_clients_person')[1],
                emotions: [],
                tweets: _tweetsBuffer.filter(item => item.rules.some(rule => rule.tag === 'grow_clients_person'))
            }],
            ['excellency_operation_person', {
                action: actions.get(country_code.toLowerCase()).get('excellency_operation_person')[1],
                emotions: [],
                tweets: _tweetsBuffer.filter(item => item.rules.some(rule => rule.tag === 'excellency_operation_person'))
            }]
        ]);*/

        socket.emit('suggestions', {_suggestions, counter: _tweetsBuffer.length});
    });
});

module.exports = app;
