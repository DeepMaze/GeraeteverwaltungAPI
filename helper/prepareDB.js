var mysql = require('mysql2/promise');

var encrypt = require('./encryption');
var queryDB = require('./queryDB');
var { mysqlConfig, generalConfig } = require('../environment/config');

var sqls = {
    db: generalConfig.sqlQuerys[0],
    config: generalConfig.sqlQuerys[1],
    users: generalConfig.sqlQuerys[2],
    devices: generalConfig.sqlQuerys[3],
    locations: generalConfig.sqlQuerys[4],
    persons: generalConfig.sqlQuerys[5]
}

const prepareDB = async () => {
    await checkAndCreateDatabase();
    await checkAndCreateTables();
    await checkConfig();
    await checkUsers();
}

const checkAndCreateDatabase = async () => {
    var connectionURI = {
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
    }
    var query = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ${mysql.escape(mysqlConfig.database)}`;
    try {
        var connection = await mysql.createConnection(connectionURI);
        var [rows] = await connection.execute(query);
        if (rows.length == 0) {
            [rows] = await connection.execute(sqls.db);
        }
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
    } finally {
        connection.end();
    }
};

const checkAndCreateTables = async () => {
    for (table in sqls) {
        if (table == 'db') { continue; }
        var query = `SHOW TABLES LIKE '${table}'`;
        try {
            var [rows] = await queryDB(query);
            if (rows.length == 0) {
                [rows] = await queryDB(sqls[table]);
            }
        } catch (err) {
            if (generalConfig.debug) { console.error('[ERROR]: ', err); }
        }
    }
}

const checkConfig = async () => {
    var selectQuery = 'SELECT ID, Config_Key, Config_Value FROM config';
    try {
        var [rows] = await queryDB(selectQuery);
        if (rows.length == 0) {
            var insertQuery = `INSERT INTO config (Config_Key, Config_Value) VALUES ('enableGuestLogin', FALSE), ('enableAccountCreation', TRUE), ('enableGuestDataManipulation', FALSE)`;
            [rows] = await queryDB(insertQuery);
        }
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
    }
}

const checkUsers = async () => {
    var selectQuery = 'SELECT ID, UserName FROM users WHERE UserName = \'Admin\' OR UserName = \'Guest\'';
    try {
        var [rows] = await queryDB(selectQuery);
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
    }
    var adminUser = rows.find(value => { return value['UserName'] == 'Admin'; });
    var guestUser = rows.find(value => { return value['UserName'] == 'Guest'; });
    try {
        if (!adminUser) {
            var insertQuery = `INSERT INTO users (UserName, PassWord_Encrypted) VALUES ('Admin', ${mysql.escape(await encrypt('admin'))});`;
            await queryDB(insertQuery);
        }
        if (!guestUser) {
            var insertQuery = `INSERT INTO users (UserName, PassWord_Encrypted) VALUES ('Guest', ${mysql.escape(await encrypt('guest'))});`;
            await queryDB(insertQuery);
        }
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
    }
}

module.exports = prepareDB;