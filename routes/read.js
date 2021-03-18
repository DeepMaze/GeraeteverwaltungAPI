var express = require('express');
var mysql = require('mysql2/promise');

var checkToken = require('../helpers/checkToken');

var generalConfig = require('../environment/general');
var mysqlConfig = require('../environment/mysql');

var router = express.Router();



router.get('/*', checkToken);

router.get('/deviceList', async (req, res, next) => {
	var query = 'SELECT * FROM devices';
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		var [rows, fields] = await connection.execute(query);
	} catch (err) {
		console.error(err);
		res.send({ error: err });
	}
	res.send(rows);
});

router.get('/device', async (req, res, next) => {
	if (!req.query) req.send({ error: 'Missing deviceID' })
	var query = `SELECT * FROM devices WHERE ${req.query['deviceID']}`;
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		var [rows, fields] = await connection.execute(query);
	} catch (err) {
		if (generalConfig.debug) { console.error(err); }
		res.send({ error: err });
	}
	res.send(rows);
});

module.exports = router;