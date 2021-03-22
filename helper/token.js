var jwt = require('jsonwebtoken');

var { createLog } = require('./logging');

var { generalConfig, tokenConfig } = require('../environment/config');



const createToken = (userID, ip) => {
	var token = jwt.sign({ userID }, tokenConfig.privateKey, { algorithm: 'RS256', expiresIn: tokenConfig.expireIn });
	if (generalConfig.log) { createLog({ type: 'tokenCreated', params: { userID, ip } }); }
	return token;
};

const verifyToken = (token, userID, ip) => {
	if (!token || !userID) { return 0 };
	try {
		var decoded = jwt.verify(token, tokenConfig.privateKey);
	} catch (err) {
		if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip } }); }
		res.send({ error: 'JSON Web Token could not be verified.' })
	}
	if (decoded.userID != userID) { return -1 };
	return 1;
};

const checkToken = (req, res, next) => {
	var tokenVerify = verifyToken(req.token, req.userID, req.socket.remoteAddress);
	switch (tokenVerify) {
		case -1: {
			if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
			res.send({ error: 'Invalid token' });
			break;
		}
		case 0: {
			if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip: req.socket.remoteAddress } }); }
			res.send({ error: 'Missing arguments' });
			break;
		}
		case 1: {
			if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: true } }); }
			next();
			break;
		}
	}
}

module.exports = { createToken, checkToken };