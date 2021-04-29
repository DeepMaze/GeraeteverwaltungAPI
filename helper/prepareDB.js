var mysql = require('mysql2/promise');
var fs = require('fs');
var path = require('path');

var encrypt = require('./encryption');
var queryDB = require('./queryDB');



const DB_QUERY_COMPLETE_ARRAY = fs.readFileSync(path.resolve('createDatabaseAndTablesQuery.sql'), 'utf8').split(';');

const DB_QUERY_SPLIT = {
    db: DB_QUERY_COMPLETE_ARRAY[0],
    config: DB_QUERY_COMPLETE_ARRAY[1],
    users: DB_QUERY_COMPLETE_ARRAY[2],
    devices: DB_QUERY_COMPLETE_ARRAY[3],
    locations: DB_QUERY_COMPLETE_ARRAY[4],
    persons: DB_QUERY_COMPLETE_ARRAY[5]
};

const prepareDB = async () => {
    await checkAndCreateDatabase();
    await checkAndCreateTables();
    await checkConfig();
    await checkUsers();
}

const checkAndCreateDatabase = async () => {
    var connectionURI = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
    }
    var query = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ${mysql.escape(process.env.MYSQL_DATABASE)}`;
    try {
        var [rows] = await queryDB(query, connectionURI);
        if (rows.length == 0) {
            [rows] = await queryDB(DB_QUERY_SPLIT.db, connectionURI);
        }
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
    }
};

const checkAndCreateTables = async () => {
    for (table in DB_QUERY_SPLIT) {
        if (table == 'db') { continue; }
        var query = `SHOW TABLES LIKE '${table}'`;
        try {
            var [rows] = await queryDB(query);
            if (rows.length == 0) {
                [rows] = await queryDB(DB_QUERY_SPLIT[table]);
            }
        } catch (err) {
            if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
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
        if (process.env.DEBUG) { console.error(err); }
    }
}

const checkUsers = async () => {
    var selectQuery = 'SELECT ID, UserName FROM users WHERE UserName = \'Admin\' OR UserName = \'Guest\'';
    try {
        var [rows] = await queryDB(selectQuery);
    } catch (err) {
        if (process.env.DEBUG) { console.error(err); }
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
        if (process.env.DEBUG) { console.error(err); }
    }
}

module.exports = prepareDB;