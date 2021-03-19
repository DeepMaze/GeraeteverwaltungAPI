var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var { createLog } = require('../helpers/logging');

var generalConfig = require('./environment/general');

var routes = require('./routes/routes.data');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes.forEach(route => {
	app.use(route.path, require(route.file));
	if (generalConfig.log) { createLog({ type: 'routeSetup', params: { port } }); }
});

module.exports = app;