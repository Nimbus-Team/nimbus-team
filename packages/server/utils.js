const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
const colors = require('colors');

const res = (abstractMatch, data, message, response) => {
    if (abstractMatch.error) {
        console.log(colors.red(`[${new Date().toLocaleDateString()}]: ${abstractMatch.error}`));
        response.status(200).json({
            error: abstractMatch.error
        });
    } else {
        console.log(colors.blue(`[${new Date().toLocaleDateString()} - ${message}]: ${JSON.stringify(data)}`));
        response.status(200).json({
            message,
            data
        });
    }
};

const handleError = (code, e) => {
    code = code || UNKNOWN_ERROR;
    e = e || {};
    console.log(colors.red(`[${new Date().toLocaleDateString()} - ${code}]:  ${JSON.stringify(e)}`));
    return {
        error: code,
        trace : e
    };
};

module.exports = {res, handleError};

