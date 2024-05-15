const createFetch = require('./fetch');
const createAuth = require('./auth');
const createSendMessage = require('./sendMessage');
const createDownload = require('./download');
const request = require('./request');
const createEvents = require('./events');
const helpers = require('./helpers');

const defaultOptions = {
    email: '',
    password: '',
    connectionId: null,
    baseUrl: 'https://api.whats2api.com',
    timeout: 10000,
    retries: 3
}

module.exports = function createClient(options) {
    options = {
        ...defaultOptions,
        ...options
    }
    if (!options.email) throw new Error('Email is required for Whats2API');
    if (!options.password) throw new Error('Password is required for Whats2API');
    if (!options.connectionId) throw new Error('Connection ID is required for Whats2API');

    const connectionId = options.connectionId;


    const fetch = createFetch({
        baseUrl: options.baseUrl,
        retries: options.retries,
        timeout: options.timeout
    });

    const userCredentials = {
        strategy: 'local',
        email: options.email,
        password: options.password
    }

    const reusableAuth = createAuth({
        fetch,
        userCredentials
    });

    const {
        auth,
        checkToken,
        authenticate,
    } = reusableAuth

    const sendMessageOps = createSendMessage({
        fetch,
        auth: reusableAuth,
        connectionId
    });
    

    const downloadOps = createDownload({
        fetch,
        auth: reusableAuth,
        connectionId
    });

    const eventsOps = createEvents({
        connectionId,
        userId: options.email
    });

    async function method(method, params) {
        if (!method) throw new Error('No method provided');
        if (!params) throw new Error('No params provided');
        if (!Array.isArray(params)) throw new Error('Params must be an array');

        return request({
            fetch,
            auth,
            connectionId,
            method,
            params
        }) 
    }

    
    
    return {
        auth,
        checkToken,
        authenticate,
        method,
        ...sendMessageOps,
        ...downloadOps,
        ...eventsOps,
        ...helpers
    }
}