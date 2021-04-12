var fs = require('fs');
var path = require('path');



var generalConfig = {
    port: 3000,
    environment: 'dev',
    debug: true,
    log: false,
    logPath: './log/',
    logMaxAge: 7,
    clearOldLogsInterval: 24,
};

var mysqlConfig = {
    host: "localhost",
    user: "service",
    password: "service",
    database: 'devicemanagement'
};

const encryptionConfig = {
    saltRounds: 10,
}

var tokenConfig = {
    privateKey: fs.readFileSync(path.resolve('keys\\private.key'), 'utf8'),
    publicKey: fs.readFileSync(path.resolve('keys\\public.key'), 'utf8'),
    expireIn: 60 * 60 * 24
};

module.exports = { generalConfig, mysqlConfig, encryptionConfig, tokenConfig };