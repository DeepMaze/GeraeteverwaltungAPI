var mysql = require('mysql2/promise');

var { mysqlConfig, generalConfig } = require('../environment/config');

const checkConfig = async () => {
    var selectQuery = 'SELECT ID, Config_Key, Config_Value FROM config';
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        var [rows] = await connection.execute(selectQuery);
        connection.end();
    } catch (err) {
        if (generalConfig.debug) { console.error(err); }
    }
    if (rows.length == 0) {
        var query = `INSERT INTO config (Config_Key, Config_Value) VALUES ('enableGuestLogin', FALSE), ('enableAccountCreation', TRUE), ('enableGuestDataManipulation', FALSE)`;
        try {
            var connection = await mysql.createConnection(mysqlConfig);
            await connection.execute(selectQuery);
            connection.end();
        } catch (err) {
            if (generalConfig.debug) { console.error(err); }
        }
    }
}

module.exports = checkConfig;