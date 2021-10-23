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

        let tweets_counter = 0;

        const countries = new Map([
            ['mx', 'México'],
            ['co', 'Colombia'],
            ['es', 'España'],
            ['pe', 'Perú'],
            ['ar', 'Argentina'],
            ['ve', 'Venezuela']
        ]);

        const actions = new Map([
            ['mx', [
                'Línea de crédito para carros eléctricos',
                'Congelar intereses durante 3 meses',
                'Doble de puntos BBVA en compras en línea'
            ]],
            ['co', [
                'Línea de crédito para carros eléctricos',
                'Congelar intereses durante 3 meses',
                'Doble de puntos BBVA en compras en línea'
            ]],
            ['es', [
                'Línea de crédito para carros eléctricos',
                'Congelar intereses durante 3 meses',
                'Doble de puntos BBVA en compras en línea'
            ]],
            ['pe', [
                'Línea de crédito para carros eléctricos',
                'Congelar intereses durante 3 meses',
                'Doble de puntos BBVA en compras en línea'
            ]],
            ['ar', [
                'Línea de crédito para carros eléctricos',
                'Congelar intereses durante 3 meses',
                'Doble de puntos BBVA en compras en línea'
            ]],
            ['ve', [
                'Línea de crédito para carros eléctricos',
                'Congelar intereses durante 3 meses',
                'Doble de puntos BBVA en compras en línea'
            ]]
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
            tweets_counter++;
            socket.emit('tweet', {
                tweet, rules, users: includes.users
            });
        }

        // TODO Analyze data

        socket.emit('suggestion', {
            country: {
                code: country_code,
                name: countries.get(country_code.toLowerCase())
            },
            action: actions.get(country_code.toLowerCase())[1],
            emotions: [],
            tweets: tweets_counter
        });
    });
});

module.exports = app;
