const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const twitterRouter = require('./routes/twitter');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(logger(process.env.ENV));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/twitter', twitterRouter);

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get(process.env.ENV) === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
