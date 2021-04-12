var mysql = require('mysql2');



const buildUpdateSetString = (data) => {
    var set = '';
    var keys = Object.keys(data);
    for (let index = 0; index < keys.length; index++) {
        if (keys[index] == 'ID') { continue; }
        if (index == keys.length - 1) {
            set += `${keys[index]} = ${mysql.escape(data[keys[index]])} `;
        } else {
            set += `${keys[index]} = ${mysql.escape(data[keys[index]])}, `;
        }
    }
    return set;
}

module.exports = buildUpdateSetString;