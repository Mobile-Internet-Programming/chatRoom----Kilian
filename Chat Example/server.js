"use strict"

const filename = '../Messages/messages.txt';

let http = require('http');
let fs = require('fs');
let url = require('url');
let Message = require('./message');
const ChatObj = require('./chatObj');

http.createServer((req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        let chats;

        if (err) throw err;
        if (data !== "") {
            chats = JSON.parse(data);
        }else {
            chats = new ChatObj();
        }
        res.writeHead(200, {'Content-Type': 'text/html', 
                            'Access-Control-Allow-Origin': '*'}
        );

        let obj = url.parse(req.url, true);
        let message = new Message(obj.query.user, obj.query.msg);
        
        chats.messages.push(message);
        append(JSON.stringify(chats));

        res.write(JSON.stringify(chats));
        res.end();
    });
}).listen(1000, () => {
    console.log('server listening at post 1000');
});

const append = (messages) => {
    fs.writeFile(filename, messages, (err) => {
        if (err) throw err;
        console.log('successfull writing');
    })
};