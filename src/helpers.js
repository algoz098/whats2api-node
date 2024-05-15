const notValidMessageType = [
    "reactionMessage",
    "protocolMessage",
    "contextInfo",
    "ptvMessage",
    "inviteLinkGroupTypeV2",
    "ephemeralMessage",
    "messageContextInfo",
];

function getType(message) {
    const types = Object.keys(message);
    return types.find((e) => message[e] !== null && !notValidMessageType.includes(e));
}

const mediaTypes = [
    'imageMessage', 'documentMessage', 'audioMessage', 'documentWithCaptionMessage',  'stickerMessage', 'videoMessage'
]

const imgTypes = [
    'imageMessage'
]
function isImg(message) {
    const type = getType(message);
    return imgTypes.includes(type);
}

const docTypes = [
    'documentMessage', 'documentWithCaptionMessage'
]
function isDoc(message) {
    const type = getType(message);
    return docTypes.includes(type);
}

const audioTypes = [
    'audioMessage'
]
function isAudio(message) {
    const type = getType(message);
    return audioTypes.includes(type);
}

const videoTypes = [
    'videoMessage'
]
function isVideo(message) {
    const type = getType(message);
    return videoTypes.includes(type);
}

const stickerTypes = [
    'stickerMessage'
]
function isSticker(message) {
    const type = getType(message);
    return stickerTypes.includes(type);
}

function isMedia(message) {
    const result = {
        media: false,
    }

    result.img = isImg(message);
    result.doc = isDoc(message);
    result.audio = isAudio(message);
    result.video = isVideo(message);
    result.sticker = isSticker(message);
    if (result.img || result.doc || result.audio || result.video || result.sticker) {
        result.media = true;
    }

    return result;
}

function getText(message) {
    const type = getType(message);
    return message[type].conversation ?? message[type].text ?? message[type].caption ?? null;
}



module.exports = {
    msg: {
        getType,
        isImg,
        isDoc,
        isAudio,
        isVideo,
        isSticker,
        isMedia,
        getText,
    }
}