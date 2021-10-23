const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const trainedData = require('./training.js');

module.exports = function(text) {
    return sentiment.analyze(text, trainedData);
}
