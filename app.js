require('dotenv').config()
var express 		= require('express');
var path 			= require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser 		= require("body-parser");
var session			= require('express-session');
var passport 		= require('passport');
var mongoose 		= require('mongoose');
var index 			= require('./routes/index');
var api 			= require('./routes/api');
var authenticate 	= require('./routes/authenticate')(passport);
var initPassport	= require('./passport-init');
var router 			= express.Router();
var app 			= express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({
	secret: 'd838a01f31a71ef89a958f69b385e404',
	saveUninitialized: false,
	resave: false,
	name: 'aaa89d79844a124811535bcdaf3e1fb8'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(logger('dev'));


initPassport(passport);
mongoose.connect(process.env.URL, {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
