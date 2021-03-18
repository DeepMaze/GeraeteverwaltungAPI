var express = require('express');
var mysql = require('mysql2/promise');

var checkToken = require('../helpers/checkToken');
var mysqlConfig = require('../environment/mysql');



var router = express.Router();

router.use('/*', checkToken);



module.exports = router;