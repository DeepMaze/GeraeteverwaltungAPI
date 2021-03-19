var express = require('express');
var mysql = require('mysql2/promise');
var bcrypt = require('bcrypt');

var { createLog } = require('../helpers/logging');
var checkToken = require('../helpers/checkToken');
var createToken = require('../helpers/createToken');

var generalConfig = require('./environment/general');
var mysqlConfig = require('../environment/mysql');
var messages = require('../environment/messages');



var router = express.Router();

router.use('/*', checkToken);

router.get('/checkLogin', async (req, res, next) => {
    var query = `SELECT Password FROM users WHERE UserID = ${mysql.escape(req.query['userID'])}`;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(query);
        connection.end();
    } catch (err) {
        if (generalConfig.log) { createLog({ type: 'loginChecked', params: { userID, ip: req.socket.remoteAddress, result: false } }); }
        res.status(500).send({ error: messages.dbConnectionFailure });
    }

    var result = bcrypt.compare(req.query['password'], rows[0]['Password'])
    if (result) {
        if (generalConfig.log) { createLog({ type: 'loginChecked', params: { userID, ip: req.socket.remoteAddress, result: true } }); }
        res.status(200).send({ token: createToken(req.query['userID']), message: messages.loginSuccessful });
    } else {
        if (generalConfig.log) { createLog({ type: 'loginChecked', params: { userID, ip: req.socket.remoteAddress, result: false } }); }
        res.status(200).send({ token: null, message: messages.loginFailed });
    }
});

module.exports = router;