var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var encrypt = require('../helper/encryption');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { mysqlConfig, generalConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

// router.use('/*', checkTokenMIDWARE);

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
        if (generalConfig.debug) { console.log('[ERROR]: ', err); }
        res.status(500).send({ error: errorMsg.dbConnectionFailure });
    }
    res.status(200).send(rows);
});

router.get('/createUser', async (req, res, next) => {
    console.log("req.query: ", req.query);
    if (!req.query) {
        console.log("IF: no query keys");
        res.status(400).send({ success: false });
        // res.status(400).send({ success: false, error: errorMsg.dbConnectionFailure });
        return;
    }
    var query = 'INSERT INTO users (UserName, PassWord_Encrypted)' +
        `VALUES (${mysql.escape(req.query['userName'])}, '${await encrypt(mysql.escape(req.query['passWord']))}')`;
    console.log(query);
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.log('[ERROR]: ', err); }
        res.status(500).send({ success: false });
        // res.status(500).send({ error: errorMsg.dbConnectionFailure });
        return;
    }
    res.status(204).send({ success: true });
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