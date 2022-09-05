/**
nexmo context:
you can find this as the second parameter of rtcEvent funciton or as part or the request in req.nexmo in every request received by the handler
you specify in the route function.

it contains the following:
const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient
} = nexmo;

- generateBEToken, generateUserToken,// those methods can generate a valid token for application
- csClient: this is just a wrapper on https://github.com/axios/axios who is already authenticated as a nexmo application and
    is gonna already log any request/response you do on conversation api.
    Here is the api spec: https://jurgob.github.io/conversation-service-docs/#/openapiuiv3
- logger: this is an integrated logger, basically a bunyan instance
- storageClient: this is a simple key/value inmemory-storage client based on redis
*/
interface Nexmo {
    generateBEToken(): string;
    generateUserToken(): string;
    logger: any;
    csClient: any;
    storageClient: any;
}

