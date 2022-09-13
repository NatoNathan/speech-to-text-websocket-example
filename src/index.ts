import { Express, Application, Request, Response } from 'express';
import { createWebSocketStream, Server } from 'ws';
import dotenv from 'dotenv';
import * as http from "http"

import client, { apiClient } from './revai.client';
import { Duplex } from 'stream';

dotenv.config();

interface Nexmo {
    generateBEToken(): string;
    generateUserToken(): string;
    logger: any;
    csClient: any;
    storageClient: any;
}

type WebhookReq<T = any> = Request & {
    nexmo: Nexmo
}

type WebhookRes = Response;

type WebhookHandler = (req: WebhookReq, res: WebhookRes, next: WebhookHandler) => any | Promise<any>;

const DATACENTER = `https://api.nexmo.com`;

let stream: Duplex;


export const voiceEvent: WebhookHandler = async (req, res, next) => {
    const { logger } = req.nexmo;

    const body = req.body;
    try {
        logger.info("event", { event: req.body });
        if ( body.direction === 'inbound' && body.status === 'completed') {
            console.log('must end call')
            stream?.end()
        }
        res.json({});
    } catch (err) {
        logger.error("Error on voiceEvent function")
    }
}

export const voiceAnswer: WebhookHandler = async (req, res, next) => {
    const { logger } = req.nexmo;
    logger.info("req", { req_body: req.body });
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
                    "uri": `ws://${req.hostname}/socket`,
                    "content-type": "audio/l16;rate=16000",
                }]
            }
        ]);
    } catch (err) {
        logger.error("Error on voiceAnswer function");
    }
}


export const route = (app: Application, express: Express) => {
};



export const serverWrapper = (server: http.Server, config: any) => {
    const wsServer = new Server({ noServer: true, path: '/socket' });

    server.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket => {
            wsServer.emit('connection', socket, request);
        });
    });


    wsServer.on('connection', (ws, connectionRequest) => {
        stream = client.start();

        stream.on('data', data => {
            //console.log(data);
        });

        stream.on('end', function () {
            console.log("End of Stream");
        });

        ws.on('close', () => {
            stream.end()
        })

        const audioStream = createWebSocketStream(ws);
        audioStream.pipe(stream);
    })
}