var express = require('express');
var mysql = require('mysql2/promise');
var bcrypt = require('bcrypt');

var checkToken = require('../helpers/checkToken');
var createToken = require('../helpers/createToken');
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
        res.status(500).send({ error: messages.dbConnectionFailure });
    }

    var result = bcrypt.compare(req.query['password'], rows[0]['Password'])
    if (result) {
        res.status(200).send({ token: createToken(req.query['userID']), message: messages.loginSuccessful });
    } else {
        res.status(200).send({ token: null, message: messages.loginFailed });
    }
});

module.exports = router;