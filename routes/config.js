var express = require('express');
var mysql = require('mysql2/promise');

var { checkTokenMIDWARE } = require('../helper/token');
var queryDB = require('../helper/queryDB');



var router = express.Router();

router.get('/getConfig', async (req, res, next) => {
    var query = 'SELECT ID, Config_Key, Config_Value FROM config';
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    res.status(200).send(rows);
});

router.post('/updateConfig', checkTokenMIDWARE, async (req, res, next) => {
    var config = JSON.parse(req.body.params['config']);
    for (key in config) {
        var query = `UPDATE config SET Config_Value = ${mysql.escape(config[key])} WHERE Config_Key = ${mysql.escape(key)};`;
        try {
            queryDB(query);
        } catch (err) {
            if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
            res.status(500).send();
        }
    }
    res.status(204).send();
});

module.exports = router;