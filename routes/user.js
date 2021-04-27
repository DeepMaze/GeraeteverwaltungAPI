var express = require('express');
var mysql = require('mysql2/promise');

var queryDB = require('../helper/queryDB');
var { checkTokenMIDWARE } = require('../helper/token');
var encrypt = require('../helper/encryption');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { generalConfig } = require('../environment/config');



var router = express.Router();

// router.use('/*', checkTokenMIDWARE);

router.get('/getUsersList', async (req, res, next) => {
    var query = 'SELECT * FROM users';
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        res.status(500).send();
    }
    res.status(200).send(rows);
});

router.get('/getUser', async (req, res, next) => {
    if (!req.query['userID']) { req.status(400).send({ error: errorMsg.missingData }) }
    var query = `SELECT * FROM users WHERE ${mysql.escape(req.query['data']['userID'])}`;
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(200).send(rows);
});

router.get('/createUser', async (req, res, next) => {
    if (!req.query) {
        res.status(400).send({ success: false });
        return;
    }
    var query = 'INSERT INTO users (UserName, PassWord_Encrypted)' +
        `VALUES (${mysql.escape(req.query['userName'])}, '${await encrypt(mysql.escape(req.query['passWord']))}')`;
    try {
        await queryDB(query);
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
        res.status(500).send({ success: false });
        return;
    }
    res.status(204).send({ success: true });
});

router.put('/updateUser', async (req, res, next) => {
    var query = `UPDATE users SET ${buildUpdateSetString(req.query['data'])} WHERE UserID = ${mysql.escape(req.query['userID'])}`;
    try {
        await queryDB(query);
    } catch (err) {
        res.status(500).send();
    }
    res.status(204).send();
});

router.put('/deleteUser', async (req, res, next) => {
    var query = `DELETE FROM users WHERE UserID = ${mysql.escape(req.query['userID'])}`;
    try {
        await queryDB(query);
    } catch (err) {
        res.status(500).send();
    }
    res.status(204).send();
});


module.exports = router;