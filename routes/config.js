var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var buildUpdateSetString = require('../helper/buildUpdateSetString');
var { mysqlConfig, generalConfig } = require('../environment/config');



var router = express.Router();

router.use('/*', checkTokenMIDWARE);

router.get('/getConfig', async (req, res, next) => {
    var query = 'SELECT ID, Config_Key, Config_Value FROM config';
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

router.post('/createConfig', async (req, res, next) => {
    var config = JSON.parse(req.body.params['config']);
    var query = 'INSERT INTO config (Config_Key, Config_Value) ' +
        `VALUES (${mysql.escape(config['Config_Key'])}, ${mysql.escape(config['Config_Value'])})`;
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

router.patch('/updateConfig', async (req, res, next) => {
    var config = JSON.parse(req.body.params['config']);
    var query = `UPDATE config SET Config_Value = ${mysql.escape(config['Config_Value'])} WHERE ID = ${mysql.escape(config.ID)}`;
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