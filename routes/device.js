var express = require('express');
var mysql = require('mysql2/promise');

var queryDB = require('../helper/queryDB');
var { checkTokenMIDWARE } = require('../helper/token');
var buildUpdateSetString = require('../helper/buildUpdateSetString');



var router = express.Router();

router.use('/*', checkTokenMIDWARE);

router.get('/getDeviceList', async (req, res, next) => {
    var query = 'SELECT ID, Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, LocationID, PersonID FROM devices';
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(200).send(rows);
});

router.get('/getDevice', async (req, res, next) => {
    if (!req.query) { req.status(400).send() }
    var query = `SELECT ID, Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, LocationID, PersonID FROM devices WHERE ${mysql.escape(req.query['data']['deviceID'])}`;
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(200).send(rows);
});

router.get('/getDeviceID', async (req, res, next) => {
    if (!req.query) { req.status(400).send() }
    var device = JSON.parse(req.query.device);
    var query = `SELECT ID FROM devices WHERE ` +
        `Label = ${mysql.escape(device['Label'])} AND ` +
        `DescriptiveInformation = ${mysql.escape(device['DescriptiveInformation'])} AND ` +
        `SerialNumber = ${mysql.escape(device['SerialNumber'])} AND ` +
        `Manufacturer = ${mysql.escape(device['Manufacturer'])} AND ` +
        `LocationID = ${mysql.escape(device['LocationID'])} AND ` +
        `PersonID = ${mysql.escape((device['PersonID']))}`;
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(200).send(rows[0]);
});

router.post('/createDevice', async (req, res, next) => {
    var device = JSON.parse(req.body.params['device']);
    if (device['LocationID'] == '') { device['LocationID'] = 0; }
    if (device['PersonID'] == '') { device['PersonID'] = 0; }
    var query = 'INSERT INTO devices (Label, DescriptiveInformation, SerialNumber, Manufacturer, Model, LocationID, PersonID) ' +
        `VALUES (` +
        `${mysql.escape(device['Label'])}, ` +
        `${mysql.escape(device['DescriptiveInformation'])}, ` +
        `${mysql.escape(device['SerialNumber'])}, ` +
        `${mysql.escape(device['Manufacturer'])}, ` +
        `${mysql.escape(device['Model'])}, ` +
        `${mysql.escape(device['LocationID'])}, ` +
        `${mysql.escape(device['PersonID'])})`;
    try {
        await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(204).send();
});

router.patch('/updateDevice', async (req, res, next) => {
    var device = JSON.parse(req.body.params['device']);
    if (device['LocationID'] && device['LocationID'] == '') { device['LocationID'] = 0; }
    if (device['PersonID'] && device['PersonID'] == '') { device['PersonID'] = 0; }
    var query = `UPDATE devices SET ${buildUpdateSetString(device)} WHERE ID = ${mysql.escape(device.ID)}`;
    try {
        await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(204).send();
});

router.delete('/deleteDevice', async (req, res, next) => {
    var query = `DELETE FROM devices WHERE ID = ${mysql.escape(parseInt(req.query['deviceID']))}`;
    try {
        await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(204).send();
});


module.exports = router;