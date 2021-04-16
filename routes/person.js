var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { mysqlConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkTokenMIDWARE);

router.get('/getPersonList', async (req, res, next) => {
    var query = 'SELECT ID, FirstName, LastName, Company FROM persons';
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

router.get('/getPerson', async (req, res, next) => {
    var query = `SELECT ID, FirstName, LastName, Company FROM persons WHERE ${mysql.escape(req.query['data']['personID'])}`;
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

router.get('/getPersonID', async (req, res, next) => {
    var person = JSON.parse(req.query.person);
    var query = `SELECT ID FROM persons WHERE ` +
        `FirstName = ${mysql.escape(person['FirstName'])} AND ` +
        `LastName = ${mysql.escape(person['LastName'])} AND ` +
        `Company = ${mysql.escape(person['Company'])}`;
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

router.post('/createPerson', async (req, res, next) => {
    var person = JSON.parse(req.body.params['person']);
    var query = 'INSERT INTO persons (FirstName, LastName, Company) ' +
        `VALUES (${mysql.escape(person['FirstName'])}, ${mysql.escape(person['LastName'])}, ${mysql.escape(person['Company'])})`;
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

router.patch('/updatePerson', async (req, res, next) => {
    var person = JSON.parse(req.body.params['person']);
    var query = `UPDATE persons SET ${buildUpdateSetString(person)} WHERE ID = ${mysql.escape(person.ID)}`;
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

router.delete('/deletePerson', async (req, res, next) => {
    var query = `DELETE FROM persons WHERE ID = ${mysql.escape(parseInt(req.query['personID']))}`;
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