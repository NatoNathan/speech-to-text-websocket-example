import dotenv from 'dotenv';
import * as revai from 'revai-node-sdk';

dotenv.config();

const REVAI_TOKEN=process.env.REVAI_TOKEN ?? "";

const audioConfig = new revai.AudioConfig(
    /* contentType */ "audio/x-raw",
    /* layout */      "interleaved",
    /* sample rate */ 16000,
    /* format */      "S16LE",
    /* channels */    1
);

const client = new revai.RevAiStreamingClient(REVAI_TOKEN, audioConfig);

export const apiClient = new revai.RevAiApiClient(REVAI_TOKEN);

// Create your event responses
client.on('close', (code, reason) => {
    console.log(`Connection closed, ${code}: ${reason}`);
});
client.on('httpResponse', code => {
    console.log(`Streaming client received http response with code: ${code}`);
})
client.on('connectFailed', error => {
    console.log(`Connection failed with error: ${error}`);
})
client.on('connect', connectionMessage => {
    console.log(`Connected with message: ${connectionMessage.type}`);
})
 

export default client;