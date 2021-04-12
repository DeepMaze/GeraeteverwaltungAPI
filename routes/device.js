var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { mysqlConfig, generalConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkTokenMIDWARE);

router.get('/getDeviceList', async (req, res, next) => {
    var query = 'SELECT ID, Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, RentStart, ExpectedReturn, LocationID, PersonID FROM devices';
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
    if (!req.query) { req.status(400).send() }
    var query = `SELECT ID, Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, RentStart, ExpectedReturn, LocationID, PersonID FROM devices WHERE ${mysql.escape(req.query['data']['deviceID'])}`;
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

router.get('/getDeviceID', async (req, res, next) => {
    if (!req.query) { req.status(400).send() }
    console.log('req.query.device: ', req.query.device);
    var device = JSON.parse(req.query.device);
    if (device.RentStart == '') {
        device.RentStart = 'IS NULL';
    } else {
        device.RentStart = `= ${mysql.escape(device.RentStart)}`;
    }
    if (device.ExpectedReturn == '') {
        device.ExpectedReturn = 'IS NULL';
    } else {
        device.ExpectedReturn = `= ${mysql.escape(device.ExpectedReturn)}`;
    }
    var query = `SELECT ID FROM devices WHERE ` +
        `Label = ${mysql.escape(device['Label'])} AND ` +
        `DescriptiveInformation = ${mysql.escape(device['DescriptiveInformation'])} AND ` +
        `SerialNumber = ${mysql.escape(device['SerialNumber'])} AND ` +
        `Manufacturer = ${mysql.escape(device['Manufacturer'])} AND ` +
        `RentStart ${device['RentStart']} AND ` +
        `ExpectedReturn ${device['ExpectedReturn']} AND ` +
        `LocationID = ${mysql.escape(device['LocationID'])} AND ` +
        `PersonID = ${mysql.escape(device['PersonID'])}`;
    console.log(query);
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    console.log("rows: ", rows);
    res.status(200).send(rows[0]);
});

router.post('/createDevice', async (req, res, next) => {
    var device = JSON.parse(req.body.params['device']);
    if (device.RentStart == '') { device.RentStart = null }
    if (device.ExpectedReturn == '') { device.ExpectedReturn = null }
    var query = 'INSERT INTO devices (Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, RentStart, ExpectedReturn, LocationID, PersonID) ' +
        `VALUES (${mysql.escape(device['Label'])}, ${mysql.escape(device['DescriptiveInformation'])}, ${mysql.escape(device['SerialNumber'])}, ` +
        `${mysql.escape(device['Manufacturer'])}, ${mysql.escape(device['Model'])}, ${mysql.escape(device['RentStart'])}, ` +
        `${mysql.escape(device['ExpectedReturn'])}, ${mysql.escape(device['LocationID'])}, ${mysql.escape(device['PersonID'])})`;
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

router.patch('/updateDevice', async (req, res, next) => {
    var device = JSON.parse(req.body.params['device']);
    var query = `UPDATE devices SET ${buildUpdateSetString(device)} WHERE ID = ${mysql.escape(device.ID)}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send();
    }
    res.status(204).send();
});

router.delete('/deleteDevice', async (req, res, next) => {
    var query = `DELETE FROM devices WHERE ID = ${mysql.escape(parseInt(req.query['deviceID']))}`;
    console.log(query);
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