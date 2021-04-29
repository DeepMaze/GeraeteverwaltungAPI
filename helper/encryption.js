var bcrypt = require('bcrypt');



var encrypt = async (data) => {
    return await bcrypt.hash(data, parseInt(process.env.TOKEN_SALTROUNDS));
}

module.exports = encrypt;