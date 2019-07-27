// Retrieve NOCList, output JSON object with user numbers

var crypto = require('crypto');
var fetch = require('node-fetch');
var constant = require('./constants.js');

async function sendRequest(path, headers) {
  let url = constant.baseUrl + path;
  let value = await recurMakeRequest(url, headers, 0);
  return value;
}

async function recurMakeRequest(url, headers, failCount) {

  if (failCount == constant.maxFailAttempts) {
    return false;
  }
  let value = await fetch(url, {
    method: 'GET',
    headers: headers
  }).then(
      response => {
      if (response.ok) {
        return response;
      }
      else {
        recurMakeRequest(url, ++failCount);
      }
    })
  .catch ( err => {recurMakeRequest(url, ++failCount)})
  return value;
}

async function main() {
  let authRequest = await sendRequest(constant.authPath, {});

  if (!authRequest) {
    console.error("Reached max fail attempts.")
    process.exit(1)
  }
  else {
   let authorizationToken = authRequest.headers.get(constant.badsecTokenHeader);
   let digestSha256 = crypto.createHash(`sha256`).update(authorizationToken + constant.userPath).digest(`hex`);
   var headers = {};
   headers[constant.checksumTokenHeader] = digestSha256;
 
   let userRequest = await sendRequest(constant.userPath, headers);
   if (!userRequest) {
     console.error("Reached max fail attempts.")
     process.exit(1)
   }
   else {
     userRequest.text()
       .then(
         response => {
           console.log(response);
           process.exit(1);
         }
       )
    }
  }
}

main();
