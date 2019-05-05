// Retrieve NOCList, output JSON object with user numbers

var express = require('express');
var crypto = require('crypto');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var constant = require('./constants.js');

// global variables
let failCount = 0;
let authorizationToken;

const requestAuthorizationToken = () => {

const authUrl = constant.url + constant.authPath;
let request = new XMLHttpRequest();
request.open("GET", authUrl);
request.send();

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status == 200) {
                failCount = 0;
                authorizationToken = request.getResponseHeader(constant.requestTokenHeader);
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

let digestSha256 = crypto.createHash(`sha256`).update(authorizationToken + constant.userPath).digest(`hex`);

let request = new XMLHttpRequest();
const userUrl = constant.url + constant.userPath;
request.open("GET", userUrl);
request.setRequestHeader(constant.responseTokenHeader,digestSha256);
request.send();

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                failCount = 0;
                console.log(JSON.stringify(request.responseText.split(`\n`)));
                process.exit(0);
            } else {
                ++failCount;
                console.error('User call failed with status: '+this.status);
            }
            main();
        }
    }
}
 
const main = () => {
    console.log(constant.maxFailAttempts);
    if (failCount < constant.maxFailAttempts) {
       authorizationToken ? requestUserList() : requestAuthorizationToken(); 
    } else {
       console.error('Reached max failed attempt.');
       process.exit(1);
    }
}

var app = express();
app.listen(5000,function () {
     main();
});
