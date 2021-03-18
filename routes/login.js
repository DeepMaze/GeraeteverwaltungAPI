var express = require('express');
var mysql = require('mysql2/promise');
var router = express.Router();
var mysqlConfig = require('../environment/mysql');




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