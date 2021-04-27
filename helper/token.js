var jwt = require('jsonwebtoken');

var { createLog } = require('./logging');

var { generalConfig, tokenConfig } = require('../environment/config');



const createToken = (userID, ip) => {
    try {
        var token = jwt.sign({ userID }, tokenConfig.privateKey, { algorithm: 'RS256' });
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
        throw err;
    }
    if (generalConfig.createLogs) { createLog({ type: 'tokenCreated', params: { userID, ip } }); }
    return token;
};

const verifyToken = (token, userID) => {
    if (!token || !userID) { return 0 };
    try {
        jwt.verify(token, tokenConfig.publicKey, { algorithm: 'RS256' });
    } catch (err) {
        throw err;
    }
    return 1;
};

const checkTokenMIDWARE = (req, res, next) => {
    var params = { token: '', userID: '' };
    if (req.method == 'GET' || req.method == 'DELETE') {
        params.token = req.query.token;
        params.userID = req.query.userID;
    } else if (req.method == 'POST' || req.method == 'PUT' || req.method == 'PATCH') {
        params.token = req.body.params.token;
        params.userID = req.body.params.userID;
    }
    try {
        var tokenVerify = verifyToken(params.token, params.userID);
    } catch (err) {
        if (generalConfig.debug) { console.error('[ERROR]: ', err); }
        if (generalConfig.createLogs) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
        res.status(500).end();
    }
    switch (tokenVerify) {
        case 0: {
            if (generalConfig.createLogs) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
            res.status(400).end();
            break;
        }
        case 1: {
            if (generalConfig.createLogs) { createLog({ type: 'tokenChecked', params: { userID, result: true } }); }
            next();
            break;
        }
    }
}

module.exports = { createToken, checkTokenMIDWARE };