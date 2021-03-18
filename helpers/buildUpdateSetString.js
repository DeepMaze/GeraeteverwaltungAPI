var mysql = require('mysql2');



const buildUpdateSetString = (data) => {
    var set = '';
    data.keys.forEach(key => {
        set += `key = ${mysql.escape(data[key])}`;
    });
    return set
}

module.exports = buildUpdateSetString;