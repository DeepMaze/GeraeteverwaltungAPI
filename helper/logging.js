var { constants } = require('fs');
var { access, writeFile, readdir, stat, rm } = require('fs/promises');

var { globalConfig } = require('../environment/config');
var { logMessage } = require('../environment/messages');



const createLog = async (data) => {
    var currDate = new Date(Date.now());
    var pathDate = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
    var filePath = `${globalConfig.logPath}/${data.type}/${pathDate}.txt`;
    try {
        var err = await access(filePath, constants.F_OK | constants.W_OK);
        if (err) {
            if (globalConfig.debug) { console.log(err); }
            return;
        }
        var message = `${currDate.getHours}:${currDate.getMinutes}:${currDate.getSeconds}.${currDate.getMilliseconds}\t${logMessage[data.status](data.parmas)}`;
        var err = await writeFile(filePath, message);
        if (err) {
            if (globalConfig.debug) { console.log(err); }
            return;
        }
    } catch (err) {
        if (globalConfig.debug) { console.log(err); }
    }
};

const handleOldLogs = async () => {
    try {
        var err = await access(globalConfig.logPath, constants.F_OK | constants.W_OK);
        if (err) {
            if (globalConfig.debug) { console.log(err); }
            return;
        }
        var filesToDelete = [];
        var folderContent = await readdir(globalConfig.logPath);
        for (var folder of folderContent) {
            var files = await readdir(`${globalConfig.logPath}/${folder}`);
            for (var file of files) {
                var fileInfo = await stat(`${globalConfig.logPath}/${folder}/${file}`);
                var fileCreationDate = new Date(fileInfo.birthtime);
                var timeDifference = Date.now().getMilliseconds() - fileCreationDate.getMilliseconds();
                if (timeDifference > 1000 * 60 * 60 * 24 * globalConfig.logMaxAge) {
                    filesToDelete.append(`${globalConfig.logPath}/${folder}/${file}`);
                }
            }
        }
        for (file of filesToDelete) { rm(file); }
    } catch (err) {
        if (globalConfig.debug) { console.log(err); }
    }
}

module.exports = { createLog, handleOldLogs };