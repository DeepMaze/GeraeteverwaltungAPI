var express = require('express');
var mysql = require('mysql2/promise');

var checkToken = require('../helpers/checkToken');
var buildUpdateSetString = require('../helpers/buildUpdateSetString');
var mysqlConfig = require('../environment/mysql');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkToken);

router.get('/getUsersList', async (req, res, next) => {
    var query = 'SELECT * FROM users';
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.get('/getUser', async (req, res, next) => {
    if (!req.query['userID']) { req.status(400).send({ error: errorMsg.missingData }) }
    var query = `SELECT * FROM users WHERE ${mysql.escape(req.query['data']['userID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.post('/createUser', async (req, res, next) => {
    var query = 'INSERT INTO users (UserName, Password, FirstName, LastName)' +
        `VALUES (${mysql.escape(req.query['data']['userName'])}, ${mysql.escape(req.query['data']['password'])}, ${mysql.escape(req.query['data']['firstName'])}, ${mysql.escape(req.query['data']['lastName'])})`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});

router.put('/updateUser', async (req, res, next) => {
    var query = `UPDATE users SET ${buildUpdateSetString(req.query['data'])} WHERE UserID = ${mysql.escape(req.query['userID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(204).send();
});

router.put('/deleteUser', async (req, res, next) => {
    var query = `DELETE FROM users WHERE UserID = ${mysql.escape(req.query['userID'])}`;
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