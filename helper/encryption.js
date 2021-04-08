var bcrypt = require('bcrypt');

var { encryptionConfig } = require('../environment/config');



var encrypt = async (data) => {
    return await bcrypt.hash(data, encryptionConfig.saltRounds)
}

module.exports = encrypt;