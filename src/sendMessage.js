const request =  require('./request')

module.exports =  function createSendMessage({
    fetch, auth, connectionId
}) {
    if (!fetch) throw new Error('No fetch provided')
    if (!auth) throw new Error('No auth provided')
    if (!connectionId) throw new Error('No connectionId provided')

    async function sendMessage(jid, text, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!text) throw new Error('No text provided');
        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    text,
                },
                options ?? {}
            ]
        }) 
    }

    async function sendLocation(jid, coords, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!coords) throw new Error('No coords provided');
        if (!coords.lat) throw new Error('No coords.lat provided');
        if (!coords.lng) throw new Error('No coords.lng provided');

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    "location": {
                        "degreesLatitude": coords.lat,
                        "degreesLongitude": coords.lng
                    }
                },
                options ?? {}
            ]
        }) 
    }

    async function sendContact(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message.contacts) throw new Error('No contacts provided');
        if (!message.contacts.displayName) throw new Error('No diplayName provided');
        if (!message.contacts.contacts?.length) throw new Error('No list of vcards inside contacts provided');
        if (!message.contacts.contacts[0].vcard) throw new Error('No vcard provided inside contacts');

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                message,
                options ?? {}
            ]
        }) 
    }

    async function sendReaction(jid, react) {
        if (!jid) throw new Error('No jid provided');
        if (!react) throw new Error('No react provided');
        if (!react.text) throw new Error('No react.text provided');
        if (!react.key) throw new Error('No react.key provided');

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {react},
            ]
        }) 
    }

    async function sendGif(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message?.url) throw new Error('No url provided');

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    video: {
                        url: message.url
                    },
                    caption: message.caption,
                    gifPlayback: true,
                },
                options ?? {}
            ]
        }) 
    }
    async function sendVideo(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message?.url) throw new Error('No url provided');
        if (!message?.mimetype) throw new Error('No mimetype provided');
        if (!message?.fileName) throw new Error('No fileName provided');

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    video: {
                        url: message.url
                    },
                    caption: message.caption,
                },
                {
                    ...(options ?? {}),
                    mimetype: message.mimetype,
                    fileName: message.fileName
                }
            ]
        }) 
    }
    async function sendImg(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message?.url) throw new Error('No url provided');
        if (!message?.mimetype) throw new Error('No mimetype provided');
        if (!message?.fileName) throw new Error('No fileName provided');

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    image: {
                        url: message.url
                    },
                    caption: message.caption,
                },
                {
                    ...(options ?? {}),
                    mimetype: message.mimetype,
                    fileName: message.fileName
                }
            ]
        }) 
    }
    
    async function sendAudio(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message?.url) throw new Error('No url provided');
        if (!message?.mimetype) throw new Error('No mimetype provided');
        if (!message?.fileName) throw new Error('No fileName provided');
        
        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    audio: {
                        url: message.url
                    }
                },
                {
                    ...(options ?? {}),
                    ptt: true,
                    mimetype: message.mimetype,
                    fileName: message.fileName
                }
            ]
        }) 
    }

    async function sendDoc(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message?.url) throw new Error('No url provided');
        if (!message?.mimetype) throw new Error('No mimetype provided');
        if (!message?.fileName) throw new Error('No fileName provided');
        
        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    document: {
                        url: message.url
                    },
                    caption: message.caption,
                },
                {
                    ...(options ?? {}),
                    mimetype: message.mimetype,
                    fileName: message.fileName
                }
            ]
        }) 
    }

    return {
        sendMessage,
        sendLocation,
        sendContact,
        sendReaction,
        sendGif,
        sendVideo,
        sendImg,
        sendAudio,
        sendDoc
    }
}