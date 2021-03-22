var express = require('express');
var mysql = require('mysql2/promise');

var { checkToken } = require('../helpers/token');
var buildUpdateSetString = require('../helpers/buildUpdateSetString');
var { mysqlConfig } = require('../environment/config');
var errorMsg = require('../environment/messages');



var router = express.Router();

router.use('/*', checkToken);

router.get('/getLocationList', async (req, res, next) => {
	var query = 'SELECT * FROM locations';
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		var [rows] = await connection.execute(query);
		connection.end();
	} catch (err) {
		if (generalConfig.debug) { console.error(err); }
		res.status(500).send({ error: errorMsg.dbConnectionFailure });
	}
	res.status(200).send(rows);
});

router.get('/getLocation', async (req, res, next) => {
	if (!req.query['locationID']) { req.status(400).send({ error: errorMsg.missingData }) }
	var query = `SELECT * FROM locations WHERE ${mysql.escape(req.query['data']['locationID'])}`;
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		var [rows] = await connection.execute(query);
		connection.end();
	} catch (err) {
		if (generalConfig.debug) { console.error(err); }
		res.status(500).send({ error: errorMsg.dbConnectionFailure });
	}
	res.status(200).send(rows);
});

router.post('/createLocation', async (req, res, next) => {
	var query = 'INSERT INTO locations (Label, City, Postalcode, Street)' +
		`VALUES (${mysql.escape(req.query['data']['label'])}, ${mysql.escape(req.query['data']['city'])}, ${mysql.escape(req.query['data']['postalcode'])}, ${mysql.escape(req.query['data']['street'])})`;
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		await connection.execute(query);
		connection.end();
	} catch (err) {
		if (generalConfig.debug) { console.error(err); }
		res.status(500).send({ error: errorMsg.dbConnectionFailure });
	}
	res.status(204).send();
});

router.put('/updateLocation', async (req, res, next) => {
	var query = `UPDATE locations SET ${buildUpdateSetString(req.query['data'])} WHERE LocationID = ${mysql.escape(req.query['locationID'])}`;
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		await connection.execute(query);
		connection.end();
	} catch (err) {
		if (generalConfig.debug) { console.error(err); }
		res.status(500).send({ error: errorMsg.dbConnectionFailure });
	}
	res.status(204).send();
});

router.put('/deleteLocation', async (req, res, next) => {
	var query = `DELETE FROM locations WHERE LocationID = ${mysql.escape(req.query['locationID'])}`;
	try {
		var connection = await mysql.createConnection(mysqlConfig);
		await connection.execute(query);
		connection.end();
	} catch (err) {
		if (generalConfig.debug) { console.error(err); }
		res.status(500).send({ error: errorMsg.dbConnectionFailure });
	}
	res.status(204).send();
});


module.exports = router;