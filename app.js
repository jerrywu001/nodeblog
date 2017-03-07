var express = require('express');
var session = require('express-session');
var sessionstore = require('sessionstore');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

/** session **/
app.use(session({
	secret : 'fens.me',
	cookie: { maxAge: 1800000 },
    store: sessionstore.createSessionStore()
}));
/** message tip **/
app.use(flash());
/** end **/

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    res.render('error', {
        message: err.message,
		title: '404',
        error: {
			status: '404',
			stack: 'We looked everywhere but we couldn not find it!'
		}
    });
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var err = new Error('Server Error');
    res.render('error', {
        message: err.message,
		title: '500',
        error: {
			status: '500',
			stack: 'Some problems with our Server,sorry!'
		}
    });
});

//module.exports = app;
app.listen(3000);
