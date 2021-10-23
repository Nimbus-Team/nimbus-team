const getReport = (data, freq) => {
    const tm = require('text-miner');
    const excludedWords = require('./excluded-words');
    const sentimentAnalyzer = require('./sentiment');
    let sentimentReport = [];

    for (const tweetRecorded of data) {
        sentimentReport = [...sentimentReport, sentimentAnalyzer(tweetRecorded['tweet']['text'])]
    }

    const report = sentimentReport.reduce((acc, curr) => {
        const texts = curr.tokens.filter(text => {
            return !text.includes('@') && text.length > 1 && !excludedWords.includes(text);
        });
        return {
            score: acc.score + curr.score,
            texts: [...acc.texts, ...texts],
            goodTexts: curr.score > 0 ? [...acc.goodTexts, ...texts] : acc.goodTexts,
            badTexts: curr.score < 0 ? [...acc.badTexts, ...texts] : acc.badTexts,
            goodScore: curr.score > 0 ? acc.goodScore + curr.score : acc.goodScore,
            badScore: curr.score < 0 ? acc.badScore + curr.score : acc.badScore,
        };
    }, {
        score: 0,
        texts: [],
        goodTexts: [],
        badTexts: [],
        goodScore: 0,
        badScore: 0
    })

    report.mean = report.score / sentimentReport.length;
    report.trend = report.mean > 0 ? 'good' : report.mean < 0 ? 'bad' : 'neutral';
    const corpus = new tm.Corpus(report.texts);
    const terms = new tm.DocumentTermMatrix(corpus);
    report.frequencies = terms.findFreqTerms(freq);

    return report;
};

module.exports = getReport;
