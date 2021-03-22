const debugMessages = {
    dbConnectionFailure: 'Something went wrong when trying to connect to the database.',
    invalidToken: 'The token supplied is not valid.',
    missingData: 'Some data is missing.',
    loginFailed: 'Wrong password.',
    loginSuccessful: 'You are now logged in.'
}

const logMessages = {
    serverStart: (params) => { return { type: 'info', msg: `Server started, listening on ${params.port}` }; },
    routeSetup: (params) => { return { type: 'info', msg: `Route '${params.path}' setup. The route executes file '${params.file}'` }; },
    tokenCreated: (params) => { return { type: 'info', msg: `Created Token for user '${params.userID}' on IP-Address '${params.ip}'` }; },
    tokenChecked: (params) => { return { type: 'info', msg: `Token check for user '${params.userID}' on IP-Address '${params.ip}' ${(params.result) ? ('succeded') : ('failed')}` }; },
    loginChecked: (params) => { return { type: 'info', msg: `IP-Address ${params.ip} ${(params.result) ? ('logged in') : ('failed to login')} with user '${params.userID}'` }; },
};

module.exports = { debugMessages, logMessages };