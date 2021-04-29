var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');


const privateKey = fs.readFileSync(path.resolve('keys\\private.key'), 'utf8');
const publicKey = fs.readFileSync(path.resolve('keys\\public.key'), 'utf8');

const createToken = (userID, ip) => {
    try {
        var token = jwt.sign({ userID }, privateKey, { algorithm: 'RS256' });
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        throw err;
    }
    return token;
};

const verifyToken = (token, userID) => {
    if (!token || !userID) { return 0 };
    try {
        jwt.verify(token, publicKey, { algorithm: 'RS256' });
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
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).end();
    }
    switch (tokenVerify) {
        case 0: {
            res.status(400).end();
            break;
        }
        case 1: {
            next();
            break;
        }
    }
}

module.exports = { createToken, checkTokenMIDWARE };