// Constants used in server.js

const authPath = '/auth';
const userPath = '/users';
const maxFailAttempts = 3;
const badsecTokenHeader = 'Badsec-Authentication-Token';
const checksumTokenHeader = 'X-Request-Checksum';
const baseUrl = 'http://127.0.0.1:8888';

module.exports = {
    baseUrl: baseUrl,
    authPath: authPath,
    userPath: userPath,
    maxFailAttempts: maxFailAttempts,
    badsecTokenHeader: badsecTokenHeader,
    checksumTokenHeader: checksumTokenHeader
};
