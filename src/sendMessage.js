const request =  require('./request')
const fs = require('fs')
const FormData = require('form-data')

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

    async function sendMedia(jid, message, options = {}, type) {
        if (!jid) throw new Error('No jid provided');
        if (!message?.url && !message.filepath) throw new Error('No file provided');
        if (!type) throw new Error('No type provided');

        if (message.filepath) {
            const form = new FormData();
            const file = fs.createReadStream(message.filepath)
            form.append('file', file);

            const payload = {
                connectionId: connectionId,
                method: "sendMessage",
                params: [
                    jid,
                    {
                        ...message,
                    },
                    {
                        ...(options ?? {}),
                    }
                ]
            }

            if (message?.mimetype) {
                payload.params[2].mimetype = message.mimetype
            }

            if (message?.fileName) {
                payload.params[2].fileName = message.fileName
            }

            if (!Object.keys(payload.params[2]).length) {
                payload.params.splice(2, 1)
            }

            form.append('data', JSON.stringify(payload));
            
            const token = await auth.authenticate();

            const headers = { 
                ...form.getHeaders(),
                'Authorization': `Bearer ${token.token}`,
            }
            
            try {
                let res = await fetch(
                    `/connections/request`,
                    {
                        method: 'POST',
                        body: form,
                        headers,
                    }
                )
                const json = await res.json()
                if (json.sucess) return json.result
                throw json
            } catch (error) {
                throw error
            }
        }

        return request({
            fetch,
            auth,
            connectionId,
            method: 'sendMessage',
            params: [
                jid,
                {
                    [type]: {
                        url: message.url
                    },
                    ...message
                },
                {
                    ...(options ?? {}),
                    mimetype: message.mimetype,
                    fileName: message.fileName
                }
            ]
        }) 

    }

    async function sendGif(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message) throw new Error('No url provided');
        message.gifPlayback = true

        return sendMedia(jid, message, options, 'gif')
    }
    async function sendVideo(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message) throw new Error('No url provided');

        return sendMedia(jid, message, options, 'video')
    }

    async function sendImg(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message) throw new Error('No url provided');

        return sendMedia(jid, message, options, 'image')
    }
    
    async function sendAudio(jid, message, options = {}) {
        
        if (!jid) throw new Error('No jid provided');
        if (!message) throw new Error('No url provided');
        message.ptt = true
        return sendMedia(jid, message, options, 'audio')
    }

    async function sendDoc(jid, message, options = {}) {
        if (!jid) throw new Error('No jid provided');
        if (!message) throw new Error('No url provided');

        return sendMedia(jid, message, options, 'document')
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