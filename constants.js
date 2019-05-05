// Constants used in server.js

const url = 'http://127.0.0.1:8888';
const authPath = '/auth';
const userPath = '/users';
const maxFailAttempts = 3;
const badsecTokenHeader = 'Badsec-Authentication-Token';
const checksumTokenHeader = 'X-Request-Checksum';

module.exports = {
    url: url,
    authPath: authPath,
    userPath: userPath,
    maxFailAttempts: maxFailAttempts,
    badsecTokenHeader: badsecTokenHeader,
    checksumTokenHeader: checksumTokenHeader
};
