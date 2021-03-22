var jwt = require('jsonwebtoken');

var { createLog } = require('../helpers/logging');

var generalConfig = require('../environment/general');
var jwtConfig = require('../environment/jsonwebtoken');



const checkToken = (token, userID, ip) => {
	if (!token || !userID) { return 0 };
	try {
		var decoded = jwt.verify(token, jwtConfig.privateKey);
	} catch (err) {
		if (generalConfig.log) { createLog({ type: 'tokenChecked', params: { userID, result: false, ip } }); }
		res.send({ error: 'JSON Web Token could not be verified.' })
	}
	if (decoded.userID != userID) { return -1 };
	return 1;
};

const checkToken_MiddlewareFunction = (req, res, next) => {
	var tokenVerify = checkToken(req.token, req.userID, req.socket.remoteAddress);
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

module.exports = checkToken_MiddlewareFunction;