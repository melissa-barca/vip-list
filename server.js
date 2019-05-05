// Retrieve NOCList, output JSON object with user numbers

var express = require('express');
var crypto = require('crypto');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//var sjcl = require('./sjcl.js');

// global constants
const url = 'http://127.0.0.1:8888';
const authPath = '/auth';
const userPath = '/users';
const maxFailAttempts = 3;

// global variables
let failCount = 0;
let authorizationToken;

const requestAuthorizationToken = () => {

console.log('requestAuthorizationToken');
const authUrl = url + authPath;
let request = new XMLHttpRequest();
request.open("GET", authUrl);
request.send();

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status == 200) {
                failCount = 0;
                authorizationToken = request.responseText;
                console.log('authorizationToken: '+authorizationToken);
            }
            else {
                console.error('Authorization call failed with status: '+this.status);
              ++failCount;
            }
            main();
        }
    }
}

const requestUserList = () => {

console.log('requestUserList');
let completeToken = authorizationToken + userPath;
console.log('completeToken: '+completeToken);
let digestSha256 = crypto.createHash(`sha256`).update(authorizationToken + userPath).digest(`hex`);

//let bitArray = sjcl.hash.sha256.hash(completeToken);
//let digestSha256 = sjcl.codec.hex.fromBits(bitArray);  
console.log('digestSha256: '+digestSha256);

let request = new XMLHttpRequest();
const userUrl = url + userPath;
request.open("GET", userUrl);
request.setRequestHeader("X-Request-Checksum",digestSha256);
request.send();

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 201) {
                failCount = 0;
                console.log(JSON.stringify(request.responseText.split(`\n`)));
            } else {
                ++failCount;
                console.error('User call failed with status: '+this.status);
            }
            main();
        }
    }
}
 
const main = () => {
    console.log('calling main');
    if (failCount < maxFailAttempts) {
       authorizationToken ? requestUserList() : requestAuthorizationToken(); 
    } else {
       console.error('Reached max failed attempt.');
       process.exit(1);
    }
}

var app = express();
app.listen(5000,function () {
     main();
     console.log('Server is listening on port 3000.');
});
