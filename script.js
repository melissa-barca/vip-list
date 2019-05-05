// simple AJAX API call
const url='http://127.0.0.1:8888/';
let failCount=0;
let authToken;
let complete=0;

const requestAuthorizationToken = () => {

console.log("requestAuthorizationToken");
const authUrl = url + "auth";

let request = new XMLHttpRequest();
request.open("GET",authUrl);
request.send();

    request.onreadystatechange = () => {
        if (request.readyState==4) {
            if (request.status==200) {
                failCount=0;
                authToken=request.responseText;
                console.log("setting authToken: "+authToken);
            }
            else {
              ++failCount;
            }
            main();
        }
    }
}

const requestUserList = () => {

let string=authToken+"/users";
let bitArray=sjcl.hash.sha256.hash(string);
let digestSHA256=sjcl.codec.hex.fromBits(bitArray);  

let request = new XMLHttpRequest();
const userUrl = url + "users";
request.open("GET",userUrl);
request.setRequestHeader("X-Request-Checksum",digestSHA256);
try
{
request.send();
} catch (err) {
    console.log(err);
    console.log("AH!");
}

    request.onreadystatechange = function() {
        if (this.readyState==4 && this.status==201) {
            failCount=0;
            complete=1;
            console.log(request.responseText);
            console.log(JSON.stringify(request.responseText.split(`\n`)));
        }
    }
}
 
const main = () => {
    if (failCount<3) {
       authToken ? requestUserList() : requestAuthorizationToken(); 
    } else {
       exit(1);
    }
}

main();
