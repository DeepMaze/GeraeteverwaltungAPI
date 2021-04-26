var mysql = require('mysql2/promise');

var { mysqlConfig } = require('../environment/config');



const queryDB = async (query) => {
    var rows;
    try {
        var connection = await mysql.createConnection(mysqlConfig);
        rows = await connection.execute(query);
    } catch (err) {
        throw err;
    } finally {
        connection.end();
    }
    return rows;
}

module.exports = queryDB;