var express = require('express');
var mysql = require('mysql2/promise');

var checkToken = require('../helpers/checkToken');
var mysqlConfig = require('../environment/mysql');



var router = express.Router();

router.post('/*', checkToken);

router.post('/newDevice', async (req, res, next) => {
    var query = 'INSERT INTO devices (Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, RentStart, ExpectedReturn, LocationID, PersonID)' +
        `VALUES (${mysql.escape(req.query['data']['label'])}, ${mysql.escape(req.query['data']['descriptiveInformation'])}, ${mysql.escape(req.query['data']['SerialNumber'])}, ` +
        `${mysql.escape(req.query['data']['Manufacturer'])}, ${mysql.escape(req.query['data']['Model'])}, ${mysql.escape(req.query['data']['RentStart'])}, ` +
        `${mysql.escape(req.query['data']['ExpectedReturn'])}, ${mysql.escape(req.query['data']['LocationID'])}, ${mysql.escape(req.query['data']['PersonID'])})`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows, fields] = await connection.execute(query);
        connection.end();
    } catch (err) {
        console.error(err);
        res.send({ error: 'Something didn´t work'});
        res.end();
    }
    res.status(204)
    res.send();
});

module.exports = router;