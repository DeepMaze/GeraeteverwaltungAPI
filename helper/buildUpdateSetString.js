var mysql = require('mysql2');



const buildUpdateSetString = (data) => {
    var set = '';
    for (key in data) {
        if (key == 'ID') { continue; }
        set += `${key} = ${mysql.escape(data[key])}, `;
    }
    set = set.substr(0, set.length - 2) + ' ';
    return set;
}

module.exports = buildUpdateSetString;