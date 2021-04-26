var mysql = require('mysql2/promise');

var encrypt = require('./encryption');
var queryDB = require('./queryDB');



const prepareDB = async () => {
    await checkConfig();
    await checkUsers();
}

const checkConfig = async () => {
    var selectQuery = 'SELECT ID, Config_Key, Config_Value FROM config';
    var rows = await queryDB(selectQuery);
    if (rows.length == 0) {
        var insertQuery = `INSERT INTO config (Config_Key, Config_Value) VALUES ('enableGuestLogin', FALSE), ('enableAccountCreation', TRUE), ('enableGuestDataManipulation', FALSE)`;
        await queryDB(insertQuery);
    }
}

const checkUsers = async () => {
    var selectQuery = 'SELECT ID, UserName FROM users WHERE UserName = \'Admin\' OR UserName = \'Guest\'';
    var [rows] = await queryDB(selectQuery);
    var adminUser = rows.find(value => { return value['UserName'] == 'Admin'; });
    var guestUser = rows.find(value => { return value['UserName'] == 'Guest'; });
    var insertQuery = '';
    if (!adminUser) {
        insertQuery += `INSERT INTO users (UserName, PassWord_Encrypted) VALUES ('Admin', ${mysql.escape(await encrypt('admin'))});`;
    }
    if (!guestUser) {
        insertQuery += `INSERT INTO users (UserName, PassWord_Encrypted) VALUES ('Guest', ${mysql.escape(await encrypt('guest'))});`;
    }
    if (insertQuery) {
        await queryDB(insertQuery);
    }
}

module.exports = prepareDB;