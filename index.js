const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname + '/public'});
});

app.use(express.static(__dirname));

server.on('request', app);

server.listen(3001, function () { console.log('Listening on 3001'); });

/** Websocket **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
  
    console.log('clients connected: ', numClients);

    ws.on('close', function close() {
        console.log('A client has disconnected');
    });
    ws.on('error', function error() {

    });
    
});

wss.on('connection', client => {
    client.on('message', (message, isBinary) => {
        [...wss.clients]
            .filter(c => c !== client)
            .forEach(c => c.send(isBinary ? message.toString() : message))
        });
});

wss.broadcast = function broadcast(data, isBinary) {
    console.log('Broadcasting: ', data);
    wss.clients.forEach(function each(client) {
      client.send(isBinary ? message.toString() : message);
    });
};

/** end websocket */

