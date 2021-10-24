require('dotenv').config();
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const Twitter = require('twitter-v2');
const getReport = require('./analyzer/reporter');

const client = new Twitter({
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes

const categoryDB = require('./db/categories');
const actionDB = require('./db/actions');

const countryController = require('./services/countries');
const clientController = require('./services/clients');
const categoryController = require('./services/categories');
const actionController = require('./services/actions');
const twitterRuleController = require('./services/twitter_rules');

// Countries

const countryRouter = express.Router();

countryRouter.get('/', countryController.getCountries);
countryRouter.post('/', countryController.createCountry);
countryRouter.put('/:code', countryController.updateCountry);
countryRouter.delete('/:code', countryController.deleteCountry);

app.use('/countries', countryRouter);

// Clients

const clientRouter = express.Router();

clientRouter.get('/', clientController.getClients);
clientRouter.post('/', clientController.createClient);
clientRouter.put('/:code', clientController.updateClient);
clientRouter.delete('/:code', clientController.deleteClient);

app.use('/clients', clientRouter);

// Categories

const categoryRouter = express.Router();

categoryRouter.get('/', categoryController.getCategories);
categoryRouter.post('/', categoryController.createCategory);
categoryRouter.put('/:code', categoryController.updateCategory);
categoryRouter.delete('/:code', categoryController.deleteCategory);

app.use('/categories', categoryRouter);

// Actions

const actionRouter = express.Router();

actionRouter.get('/', actionController.getActions);
actionRouter.post('/', actionController.createAction);
actionRouter.put('/:code', actionController.updateAction);
actionRouter.delete('/:code', actionController.deleteAction);
actionRouter.put('/:code/location', actionController.addLocation);
actionRouter.delete('/:code/location', actionController.removeLocation);
actionRouter.put('/:code/client', actionController.addClient);
actionRouter.delete('/:code/client', actionController.removeClient);
actionRouter.put('/:code/category', actionController.addCategory);
actionRouter.delete('/:code/category', actionController.removeCategory);

app.use('/actions', actionRouter);

// Twitter rules

const twitterRulerRouter = express.Router();

twitterRulerRouter.post('/create', twitterRuleController.createRule);
twitterRulerRouter.post('/remove', twitterRuleController.deleteRule);
twitterRulerRouter.get('/', twitterRuleController.getRules);

app.use('/rules', twitterRulerRouter);

// Sockets

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST", "OPTIONS"]
    }
});

server.listen(process.env.PORT, () => console.log(`Node server listening on port ${process.env.PORT}!`));

// Streaming

io.on('connection', async (socket) => {
    console.log('connected!');

    socket.on('request-suggestion', async (country_code) => {
        console.log(`Requesting suggestion for ${country_code} at ${new Date()}`);

        const filterLocation = async (tweet, location) => {
            let filtered = false;
            const countryDB = require('./db/countries');
            const locations = (await countryDB.get(location)).locations;

            if (locations.some(_location => tweet.users.reduce((acc, i) => {
                return acc + i.location;
            }, '').toLowerCase().includes(_location.toLowerCase()))) {
                filtered = true;
            }

            return filtered;
        };

        const _tweetsBuffer = [];

        const countries = new Map([
            ['mx', 'México'],
            ['co', 'Colombia'],
            ['es', 'España'],
            ['pe', 'Perú'],
            ['ar', 'Argentina'],
            ['ve', 'Venezuela']
        ]);

        const categories = await categoryDB.getAll();

        const stream = client.stream('tweets/search/stream', {
            'user.fields': 'username,location',
            'tweet.fields': 'created_at',
            'place.fields': 'country,country_code,place_type',
            expansions: 'author_id'
        });

        setTimeout(() => {
            stream.close();
        }, Number(process.env.STREAM_LISTENING_TIME) || 120000);

        for await (const {data: tweet, includes, matching_rules: rules} of stream) {
            const _itemTweet = {
                tweet, rules, users: includes.users
            };
            if (await filterLocation(_itemTweet, country_code)) {
                _tweetsBuffer.push(_itemTweet);
                socket.emit('tweet', _itemTweet);
            }
        }

        const _suggestions = new Map();

        for (const {code: category} of categories) {
            const tweets = _tweetsBuffer.filter(item => item.rules.some(rule => rule.tag === category));
            const report = getReport(tweets, 10);
            _suggestions.set(category, {
                action: actionDB.getByRecognize('user', category, country_code, report.trend),
                tweets,
                report
            });
        }

        fs.writeFileSync(`${country_code}_${new Date().getTime()}_tweets.json`, JSON.stringify(_tweetsBuffer));

        socket.emit('suggestions', {
            suggestions: Array.from(_suggestions, ([category, suggestion]) => ({
                category: categoryDB.get(category),
                suggestion
            })),
            counter: _tweetsBuffer.length
        });
    });
});

module.exports = app;
