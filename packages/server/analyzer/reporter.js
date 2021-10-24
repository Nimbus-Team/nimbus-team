const getReport = (data, freq) => {
    const tm = require('text-miner');
    const sentimentAnalyzer = require('./Sentiment');
    let sentimentReport = [];

    for (const tweetRecorded of data) {
        sentimentReport = [...sentimentReport, sentimentAnalyzer(tweetRecorded['tweet']['text'])]
    }

    const report = sentimentReport.reduce((acc, curr) => {
        return {
            score: acc.score + curr.score,
            texts: [...acc.texts, ...curr.tokens],
            goodTexts: curr.score > 0 ? [...acc.goodTexts, ...curr.tokens] : acc.goodTexts,
            badTexts: curr.score < 0 ? [...acc.badTexts, ...curr.tokens] : acc.badTexts,
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
    });

    report.mean = report.score / sentimentReport.length;
    report.trend = report.mean > 0.1 ? 'good' : report.mean < -0.1 ? 'bad' : 'neutral';
    const corpus = new tm.Corpus(report.texts);
    const terms = new tm.DocumentTermMatrix(corpus);
    report.frequencies = terms.findFreqTerms(freq);

    return report;
};

module.exports = getReport;
