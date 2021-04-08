var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');

var { createLog } = require('./helper/logging');
var { generalConfig, tokenConfig } = require('./environment/config');
var routes = require('./environment/routes');



var app = express();

var cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));

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