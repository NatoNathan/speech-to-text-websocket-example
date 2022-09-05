import { Express, Request, Response } from 'express';
import expressWs, { Application } from 'express-ws';
import WebSocket from 'ws';

interface Nexmo {
    generateBEToken(): string;
    generateUserToken(): string;
    logger: any;
    csClient: any;
    storageClient: any;
}

type WebhookReq<T=any> = Request & {
    nexmo: Nexmo
}

type WebhookRes = Response;

type WebhookHandler = (req: WebhookReq, res: WebhookRes, next: WebhookHandler) => any | Promise<any>;

const DATACENTER = `https://api.nexmo.com`


export const voiceEvent: WebhookHandler = async (req, res, next) => {
    const { logger } = req.nexmo;
    try { 
        logger.info("event", { event: req.body});
        res.json({});
    } catch (err) {
        logger.error("Error on voiceEvent function")
    }
}

export const voiceAnswer: WebhookHandler = async (req, res, next) => {
    const { logger } = req.nexmo;
    logger.info("req", { req_body: req.body});
    try {
        return res.json([
            {
                "action": "talk",
                "text": "Please wait while we connect you to the echo server"
            },
            {
                "action": "connect",
                "from": "NexmoTest",
                "endpoint": [{
                    "type": "websocket",
                    "uri": `wss://${req.hostname}/socket`,
                    "content-type": "audio/l16;rate=16000",
                }]
            }
        ]);
    } catch (err) {
        logger.error("Error on voiceAnswer function");
    }
}


export const route = (app: Application, express: Express) => {
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
