const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const trainedData = require('./training.js');
const excludedWords = require('./excluded-words');

module.exports = function(text) {
    const numbersRegex = new RegExp('[0-9]');
    const cleanText = text.split(' ').filter(word => {
        return !word.includes('@') && word.length > 1 && !excludedWords.includes(word) && !numbersRegex.test(word);
    }).join(' ');
    return sentiment.analyze(cleanText, trainedData);
}
