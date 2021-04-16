var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { mysqlConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkTokenMIDWARE);

router.get('/getLocationList', async (req, res, next) => {
    var query = 'SELECT ID, Label, DescriptiveInformation, Postalcode, City, Street FROM locations';
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send();
    }
    res.status(200).send(rows);
});

router.get('/getLocation', async (req, res, next) => {
    var query = `SELECT ID, Label, DescriptiveInformation, Postalcode, City, Street FROM locations WHERE ${mysql.escape(req.query['data']['locationID'])}`;
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

router.get('/getLocationID', async (req, res, next) => {
    var location = JSON.parse(req.query.location);
    var query = `SELECT ID FROM locations WHERE ` +
        `Label = ${mysql.escape(location['Label'])} AND ` +
        `DescriptiveInformation = ${mysql.escape(location['DescriptiveInformation'])} AND ` +
        `Postalcode = ${mysql.escape(location['Postalcode'])} AND ` +
        `City = ${mysql.escape(location['City'])} AND ` +
        `Street ${location['Street']}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send();
    }
    res.status(200).send(rows[0]);
});

router.post('/createLocation', async (req, res, next) => {
    var location = JSON.parse(req.body.params['location']);
    var query = 'INSERT INTO locations (Label, DescriptiveInformation, Postalcode, City, Street) ' +
        `VALUES (${mysql.escape(location['Label'])}, ${mysql.escape(location['DescriptiveInformation'])}, ${mysql.escape(location['Postalcode'])}, ` +
        `${mysql.escape(location['City'])}, ${mysql.escape(location['Street'])})`;
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

router.patch('/updatelocation', async (req, res, next) => {
    var location = JSON.parse(req.body.params['location']);
    var query = `UPDATE locations SET ${buildUpdateSetString(location)} WHERE ID = ${mysql.escape(location.ID)}`;
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

router.delete('/deleteLocation', async (req, res, next) => {
    var query = `DELETE FROM locations WHERE ID = ${mysql.escape(parseInt(req.query['locationID']))}`;
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

module.exports = router;