// cheat program when hash already known

let userRequest = new XMLHttpRequest();
const userUrl='http://127.0.0.1:8888/users';
userRequest.open("GET",userUrl);
userRequest.setRequestHeader("X-Request-Checksum","B1F3387EB52D9C706B8749BAB5C413553990A2DB6D14C8D3EF7F4CCF302E6AF6");
userRequest.send();

userRequest.onreadystatechange=function(){
    if (this.readyState==4) {
        if (this.status==200) {
            //console.log(userRequest.responseText);
            console.log(JSON.stringify(userRequest.responseText.split(`\n`)));
        }
        else {
          ++failCount;
          console.error("Authorization Failed with Status "+this.status);
        }
    }
}
