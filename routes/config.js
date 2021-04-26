var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var { mysqlConfig, generalConfig } = require('../environment/config');



var router = express.Router();

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

router.post('/updateConfig', checkTokenMIDWARE, async (req, res, next) => {
    var config = JSON.parse(req.body.params['config']);
    const keys = Object.keys(config);
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        keys.forEach(async key => {
            var query = `UPDATE config SET Config_Value = ${mysql.escape(config[key])} WHERE Config_Key = ${mysql.escape(key)};`;
            await connection.execute(query);
        })
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
        res.status(500).send();
    }
    res.status(204).send();
});

module.exports = router;