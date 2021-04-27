var { constants } = require('fs');
var { access, writeFile, readdir, stat, rm } = require('fs/promises');

var { generalConfig } = require('../environment/config');
var logMessage = require('../environment/messages');



const createLog = async (type, status, params) => {
    var currDate = new Date(Date.now());
    var pathDate = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
    var filePath = `${generalConfig.createLogsPath}/${type}/${pathDate}.txt`;
    try {
        var err = await access(filePath, constants.F_OK | constants.W_OK);
        if (err) {
            if (generalConfig.debug) { console.error('[ERROR]: ', err); }
            return;
        }
        var message = `${currDate.getHours}:${currDate.getMinutes}:${currDate.getSeconds}.${currDate.getMilliseconds}\t${logMessage[status](params)}`;
        var err = await writeFile(filePath, message);
        if (err) {
            if (generalConfig.debug) { console.error('[ERROR]: ', err); }
            return;
        }
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
    }
};

const handleOldLogs = async () => {
    try {
        var err = await access(generalConfig.createLogsPath, constants.F_OK | constants.W_OK);
        if (err) {
            if (generalConfig.debug) { console.error('[ERROR]: ', err); }
            return;
        }
        var filesToDelete = [];
        var folderContent = await readdir(generalConfig.createLogsPath);
        for (var folder of folderContent) {
            var files = await readdir(`${generalConfig.createLogsPath}/${folder}`);
            for (var file of files) {
                var fileInfo = await stat(`${generalConfig.createLogsPath}/${folder}/${file}`);
                var fileCreationDate = new Date(fileInfo.birthtime);
                var timeDifference = Date.now().getMilliseconds() - fileCreationDate.getMilliseconds();
                if (timeDifference > 1000 * 60 * 60 * 24 * generalConfig.createLogsMaxAge) {
                    filesToDelete.append(`${generalConfig.createLogsPath}/${folder}/${file}`);
                }
            }
        }
        for (file of filesToDelete) { rm(file); }
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
    }
}

module.exports = { createLog, handleOldLogs };