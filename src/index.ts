import { Express } from 'express';
import expressWs, { Application } from 'express-ws';
import WebSocket from 'ws'

const DATACENTER = `https://api.nexmo.com`

const route = (app: Application, express: Express) => {
    const eWs = expressWs(app);


    eWs.getWss().on('connection', function (ws) {
        console.log('Websocket connection is open');
    });

    // websocket middleware
    app.ws('/socket', (ws, req) => {
        ws.on('message', (msg) => {
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) ws.send(msg);
            }, 500);
        });
    });
};



module.exports = {
    route
}
