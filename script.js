// Retrieve NOCList, output JSON object with user numbers

// global constants
const url = 'http://127.0.0.1:8888';
const authPath = '/auth';
const userPath = '/users';
const maxFailAttempts = 3;

// global variables
let failCount = 0;
let authorizationToken;

const requestAuthorizationToken = () => {

const authUrl = url + authPath;
let request = new XMLHttpRequest();
request.open("GET", authUrl);
request.send();

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status == 200) {
                failCount = 0;
                authorizationToken = request.responseText;
            }
            else {
              ++failCount;
            }
            main();
        }
    }
}

const requestUserList = () => {

let completeToken = authorizationToken + userPath;
let bitArray = sjcl.hash.sha256.hash(completeToken);
let digestSHA256 = sjcl.codec.hex.fromBits(bitArray);  

let request = new XMLHttpRequest();
const userUrl = url + userPath;
request.open("GET", userUrl);
request.setRequestHeader("X-Request-Checksum",digestSHA256);
request.send();

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 201) {
                failCount = 0;
                console.log(JSON.stringify(request.responseText.split(`\n`)));
            } else {
                ++failCount;
            }
            main();
        }
    }
}
 
const main = () => {
    if (failCount < maxFailAttempts) {
       authorizationToken ? requestUserList() : requestAuthorizationToken(); 
    } else {
       exit(1);
    }
}

main();
