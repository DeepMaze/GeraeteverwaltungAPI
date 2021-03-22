var express = require('express');
var mysql = require('mysql2/promise');

var { checkToken } = require('../helper/token');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { mysqlConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkToken);

router.get('/getPersonList', async (req, res, next) => {
    var query = 'SELECT * FROM persons';
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.get('/getPerson', async (req, res, next) => {
    if (!req.query['personID']) { req.status(400).send({ error: errorMsg.missingData }) }
    var query = `SELECT * FROM persons WHERE ${mysql.escape(req.query['data']['personID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.post('/createPerson', async (req, res, next) => {
    var query = 'INSERT INTO persons (FirstName, LastName, Company)' +
        `VALUES (${mysql.escape(req.query['data']['firstName'])}, ${mysql.escape(req.query['data']['lastName'])}, ${mysql.escape(req.query['data']['company'])})`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});

router.put('/updatePerson', async (req, res, next) => {
    var query = `UPDATE persons SET ${buildUpdateSetString(req.query['data'])} WHERE PersonID = ${mysql.escape(req.query['personID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});

router.put('/deletePerson', async (req, res, next) => {
    var query = `DELETE FROM persons WHERE PersonID = ${mysql.escape(req.query['PersonID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});


module.exports = router;