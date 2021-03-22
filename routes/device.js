var express = require('express');
var mysql = require('mysql2/promise');

var { checkToken } = require('../helpers/token');
var buildUpdateSetString = require('../helpers/buildUpdateSetString');
var { mysqlConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkToken);

router.get('/getDeviceList', async (req, res, next) => {
    var query = 'SELECT * FROM devices';
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.get('/getDevice', async (req, res, next) => {
    if (!req.query) req.send({ error: 'Missing deviceID' })
    var query = `SELECT * FROM devices WHERE ${mysql.escape(req.query['data']['deviceID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.post('/createDevice', async (req, res, next) => {
    var query = 'INSERT INTO devices (Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, RentStart, ExpectedReturn, LocationID, PersonID)' +
        `VALUES (${mysql.escape(req.query['data']['label'])}, ${mysql.escape(req.query['data']['descriptiveInformation'])}, ${mysql.escape(req.query['data']['SerialNumber'])}, ` +
        `${mysql.escape(req.query['data']['Manufacturer'])}, ${mysql.escape(req.query['data']['Model'])}, ${mysql.escape(req.query['data']['RentStart'])}, ` +
        `${mysql.escape(req.query['data']['ExpectedReturn'])}, ${mysql.escape(req.query['data']['LocationID'])}, ${mysql.escape(req.query['data']['PersonID'])})`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});

router.put('/updateDevice', async (req, res, next) => {
    var query = `UPDATE devices SET ${buildUpdateSetString(req.query['data'])} WHERE DeviceID = ${mysql.escape(req.query['deviceID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});

router.put('/deleteDevice', async (req, res, next) => {
    var query = `DELETE FROM devices WHERE DeviceID = ${mysql.escape(req.query['deviceID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});


module.exports = router;