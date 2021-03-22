var config = {
    port: 3000,
    environment: 'dev',
    get debug() { return (config.environment == "dev") ? (true) : (false) },
    get log() { return (config.environment == "prod") ? (true) : (false) },
    logPath: './log/',
    logMaxAge: 7
};

module.exports = config;