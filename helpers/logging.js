var fs = require('fs/promises');
var globalConfig = require('../environment/general');



const messages = {
    serverStart: (params) => { return { type: 'info', msg: `Server started, listening on ${params.port}` }; },
    routeSetup: (params) => { return { type: 'info', msg: `Route '${params.path}' setup. The route executes file '${params.file}'` }; },
    tokenCreated: (params) => { return { type: 'info', msg: `Created Token for user '${params.userID}' on IP-Address '${params.ip}'` }; },
    tokenChecked: (params) => { return { type: 'info', msg: `Token check for user '${params.userID}' on IP-Address '${params.ip}' ${(params.result) ? ('succeded') : ('failed')}` }; },
    loginChecked: (params) => { return { type: 'info', msg: `IP-Address ${params.ip} ${(params.result) ? ('logged in') : ('failed to login')} with user '${params.userID}'` }; },
};

const createLog = (data) => {
    var currDate = new Date(Date.now());
    var pathDate = `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`;
    var filePath = `${globalConfig.logPath}/${data.type}/${pathDate}.txt`;

    var err = await fs.access(filePath, constants.F_OK | fs.constants.W_OK);
    if (err) {
        if (globalConfig.debug) { console.log(err); }
        return;
    }
    var message = `${currDate.getHours}:${currDate.getMinutes}:${currDate.getSeconds}.${currDate.getMilliseconds}\t${messages[data.status](data.parmas)}`;
    var err = await fs.writeFile(filePath, message);
    if (err) {
        if (globalConfig.debug) { console.log(err); }
        return;
    }
};

const handleOldLogs = () => {
    var err = await fs.access(globalConfig.logPath, constants.F_OK | fs.constants.W_OK);
}

module.exports = { createLog, handleOldLogs };