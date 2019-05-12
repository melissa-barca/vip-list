// Retrieve NOCList, output JSON object with user numbers

var express = require('express');
var crypto = require('crypto');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var constant = require('./constants.js');

const sendRequest = (path, headers) => {
  let url = constant.url + path;
  return recurMakeRequest(url, headers, 0)
}

const recurMakeRequest = (url, headers, failCount) => {
  if (failCount == constant.maxFailAttempts) {
    return false;
  }

  let request = new XMLHttpRequest();
  request.open("GET", url, false);

  Object.entries(headers).forEach(([key, value]) => {
    request.setRequestHeader(key, value);
  });

  request.send();
  if (request.status == 200) {
    return request;
  }
  recurMakeRequest(url, ++failCount);
}

const main = () => {
    let authRequest = sendRequest(constant.authPath, {});
    if (!authRequest) {
      console.error("Reached max fail attempts.")
      process.exit(1)
    }

    let authorizationToken = authRequest.getResponseHeader(constant.badsecTokenHeader);
    let digestSha256 = crypto.createHash(`sha256`).update(authorizationToken + constant.userPath).digest(`hex`);
    var headers = {};
    headers[constant.checksumTokenHeader] = digestSha256;

    let userRequest = sendRequest(constant.userPath, headers);
    if (!userRequest) {
      console.error("Reached max fail attempts.")
      process.exit(1)
    }
    console.log(JSON.stringify(userRequest.responseText.split(`\n`)));
    process.exit(0);
}

main();
