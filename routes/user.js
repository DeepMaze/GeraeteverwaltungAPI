var express = require('express');
var mysql = require('mysql2/promise');

var checkToken = require('../helpers/checkToken');
var mysqlConfig = require('../environment/mysql');



var router = express.Router();

router.use('/*', checkToken);

router.get('/', async (req, res, next) => {
    var query = '';
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows, fields] = await connection.execute(query);
    } catch (err) {
        console.error(err);
    }
    res.send(rows);
});

module.exports = router;