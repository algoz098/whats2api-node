const request  = require('./request')
module.exports =  function createDownload({
    fetch, auth, connectionId
}) {
    if (!fetch) throw new Error('No fetch provided')
    if (!auth) throw new Error('No auth provided')
    if (!connectionId) throw new Error('No connectionId provided')

    async function downloadMedia(message) {
        if (!message) throw new Error('No message provided to download');
        if (!message.key) throw new Error('Invalid message object provided: mediaKey missing');
        if (!message.message) throw new Error('Invalid message object provided: message missing');
        if (!Object.keys(message.message).length) throw new Error('Invalid message object provided: no message object found');
        return request({
            fetch,
            auth,
            connectionId,
            method: 'downloadMediaMessage',
            media: true,
            params: [
                message
            ]
        })
    }


    return {
        downloadMedia
    }
}