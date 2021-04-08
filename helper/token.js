var jwt = require('jsonwebtoken');

var { createLog } = require('./logging');

var { generalConfig, tokenConfig } = require('../environment/config');



const createToken = (userID, ip) => {
    try {
        var token = jwt.sign({ userID }, tokenConfig.privateKey, { algorithm: 'RS256', expiresIn: tokenConfig.expireIn });
    } catch (err) {
        if (generalConfig.debug) { console.log('[ERROR]: ', err); }
        throw err;
    }
    if (generalConfig.log) { createLog({ type: 'tokenCreated', params: { userID, ip } }); }
    return token;
};

const verifyToken = (token, userID) => {
    if (!token || !userID) { return 0 };
    try {
        var decoded = jwt.verify(token, tokenConfig.privateKey);
    } catch (err) {
        throw err;
    }
    console.log(token)
    if (decoded.userID != userID) { return -1 };
    return 1;
};

const checkTokenMIDWARE = (req, res, next) => {
    try {
        var tokenVerify = verifyToken(req.token, req.userID);
    } catch (err) {
        if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
        res.status(500).end()
    }
    switch (tokenVerify) {
        case -1: {
            if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
            res.status(200).end();
            break;
        }
        case 0: {
            if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
            res.status(400).end();
            break;
        }
        case 1: {
            if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: true } }); }
            next();
            break;
        }
    }
}

module.exports = { createToken, checkTokenMIDWARE };