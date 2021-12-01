"use strict"

const buttonID = "#send";
const Messages = document.querySelector("#messages");

document.querySelector(buttonID).onclick = () => { 
    const User = document.querySelector("#user").value;
    const Message = document.querySelector("#message").value;
    let obj = {
        user : User,
        msg : Message
    };

    sendRequest('GET', 
                'http://localhost:1000/', 
                obj, 
                (res) => {
                    writeResponses(res);
                }
    );
}

const writeResponses = (messages) => {
    Messages.innerHTML = '';
    for (let j = 0; j < JSON.parse(messages).messages.length; j++) {
        Messages.append(createLi(JSON.parse(messages).messages[j]));
    }
}

const createLi = (message) => {
    let li = document.createElement("div");
    li.innerHTML = 
    `<strong>${message.user}</strong> : &nbsp;${message.message}`;
    return li;
}

const sendRequest = (method, urlP, paramObj, response) => {
    let request = new XMLHttpRequest();

    if (method === 'GET' || method === 'DELETE') {
        let url = new URL(urlP);
        for (let key in paramObj) {
            url.searchParams.set(key, paramObj[key]);
        }

        request.open(method, url, true);
        request.send();

    }else if (method === 'PUT' || method === 'POST') {
        request.open(method, urlP, true);
        let json = JSON.stringify(paramObj);

        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        request.send(json);
    }
    request.onload = function() {
        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        }else {
            response(request.response);
        }
    }

    request.onerror = function() {
        console.log('Error happened while trasmitting the message.');
    }
}