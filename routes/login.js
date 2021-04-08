var express = require('express');
var mysql = require('mysql2/promise');
var bcrypt = require('bcrypt');

var { createLog } = require('../helper/logging');
var { createToken, checkTokenMIDWARE } = require('../helper/token');
var { generalConfig, mysqlConfig } = require('../environment/config');
var messages = require('../environment/messages');
const { JsonWebTokenError } = require('jsonwebtoken');



var router = express.Router();

router.get('/login', async (req, res, next) => {
    if (!req.query) {
        res.status(400).send({ userData: null });
        return;
    }

    var query = `SELECT ID, PassWord_Encrypted FROM users WHERE UserName = ${mysql.escape(req.query['userName'])}`;

    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        console.log(err);
        if (generalConfig.log) { createLog('loginChecked', null, { userID, ip: req.socket.remoteAddress, result: false }); }
        res.status(500).send({ error: messages.dbConnectionFailure });
    }

    if (!rows || rows.length == 0) {
        res.status(200).send({ userData: null });
        return;
    }

    try {
        var passWordResult = bcrypt.compare(req.query['passWord'], rows[0]['PassWord_Encrypted'])
    } catch (err) {
        console.log(err);
        if (generalConfig.log) { createLog('loginChecked', null, { userID, ip: req.socket.remoteAddress, result: false }); }
        res.status(500).send({ error: messages.dbConnectionFailure });
    }

    if (generalConfig.log) { createLog('loginChecked', null, { userID, ip: req.socket.remoteAddress, result: passWordResult }); }

    if (passWordResult) {
        try {
            var userData = {
                userID: rows[0]?.id,
                userName: req.query['userName'],
                token: createToken(rows[0]?.userID)
            };
        } catch (err) {
            if (generalConfig.debug) { console.log("[ERROR]: ", err); }
            res.status(500).send();
        }
        res.status(200).send({ userData: userData });
    } else {
        res.status(400).send({ userData: null });
    }
});

router.get('/checkToken', async (req, res, next) => { 
    var result = await checkToken()
 });


module.exports = router;