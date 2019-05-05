// Constants used in server.js

const url = 'http://127.0.0.1:8888';
const authPath = '/auth';
const userPath = '/users';
const maxFailAttempts = 3;
const requestTokenHeader = 'Badsec-Authentication-Token';
const responseTokenHeader = 'X-Request-Checksum';

module.exports = {
    url: url,
    authPath: authPath,
    userPath: userPath,
    maxFailAttempts: maxFailAttempts,
    requestTokenHeader: requestTokenHeader,
    responseTokenHeader: responseTokenHeader
};
