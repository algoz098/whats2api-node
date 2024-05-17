# Whats2Api

This is a Node.js library for interacting with the Whats2Api service.

Whats2Api is a wrapper platform for using with easy the library: https://github.com/WhiskeySockets/Baileys without having to worry about server, deploys.
Where you can have as much whatsapp numbers as you want.
Send, receive, and update messages, groups and more.

As cheap as possible. With a freetier.

## Requirements

- Node.js >= 18.0.0

## Installation

```sh
npm install whats2api
```

## Usage

First create your account in: https://whats2api.com;
Create your connection in: https://whats2api.com.
Use the interface in https://whats2api.com to connect your whatsapp.
Now you can use the lib.

### Basic example

```js
import createWhats2ApiClient from "whats2api";

const client = createWhats2ApiClient({
  email: "your-email",
  password: "your-password",
  connectionId: "your-connection-id",
});

const jid = "WHATSAPP_NUMBER@s.whatsapp.net"; // this is a JID which is a whatsapp user ID
const text = "Hi there!";

const msg = await client.sendMessage(jid, text);
console.log(
  "Here it is the msg object, save it, you will be able to use:",
  msg
);
```

### Reply to a message

```js
await client.sendMessage(jid, text, { quoted: msg }); // msg from the basic example
```

### Sending location

```js
await client.sendLocation(jid, {
  lat: 24.121231,
  lng: 55.1121221,
});
```

### Sending contact(s)

```js
await client.sendContact(jid, {
  contacts: {
    displayName: "Jeff",
    contacts: [
      {
        vcard:
          "BEGIN:VCARD\nVERSION:3.0\nFN:Jeff Someone\nORG:An org;\nTEL;type=CELL;type=VOICE;waid=999999999:+99 12345 67890\nEND:VCARD",
      },
    ],
  },
});
```

### Sending an reaction

```js
await client.sendReaction(jid, {
  text: "💖",
  key: msg.key, // msg from the basic example
});
```

### Sending medias

You can send medias in two ways, using a public url, or defining a local file to upload to whatsapp

#### For local files:

```js
const filepath = path.resolve(__dirname, "example.jpg"); // you can define the file here for example
console.log("sending image...", filepath);
// caption is optional
let res = await client.sendImg(jid, { filepath, caption: "Hello World" }); // if used filepath, it will try to find locally
```

All the methods available:

- `client.sendGif`
- `client.sendVideo`
- `client.sendImg`
- `client.sendAudio`
- `client.sendDoc`

#### For public urls:

```js
const mp4Url =
  "https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/04/file_example_MP4_480_1_5MG.mp4";
console.log("sending gif...");
// caption is optional
await client.sendGif(jid, { url: mp4Url, caption: "Hello World" });

console.log("sending video...");
// caption is optional
await client.sendVideo(jid, {
  url: mp4Url,
  mimetype: "video/mp4",
  fileName: "video.mp4",
  caption: "Hello World",
});

const jpgUrl =
  "https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/10/file_example_JPG_100kB.jpg";
console.log("sending image...");
// caption is optional
await client.sendImg(jid, {
  url: jpgUrl,
  mimetype: "image/jpeg",
  fileName: "image.jpg",
  caption: "Hello World",
});

const audioUrl =
  "https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/11/file_example_MP3_700KB.mp3";
console.log("sending audio...");
// there is no caption for audio
await client.sendAudio(jid, {
  url: audioUrl,
  mimetype: "audio/mp3",
  fileName: "audio.mp3",
});

const docUrl =
  "https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/10/file-sample_150kB.pdf";
console.log("sending document...");
// caption is optional
await client.sendDoc(jid, {
  url: docUrl,
  mimetype: "application/pdf",
  fileName: "document.pdf",
  caption: "Hello World",
});
```

### Download medias

When you send or receive a media, whats2api sends a event to your application, it contains information about the media, and you can request it as follows

```js
// msg is a event which comes through
const mediaArraybuffer = await client.downloadMedia(message);
// now you can save somewhere like locally
fs.writeFileSync("image.jpg", Buffer.from(mediaArraybuffer));
```

### Extras

Whats2API allow more functions which are wrapped in this lib, for such you can use as:

```js
const params = [
  // params are always a array
  "WHATSAPP_NUMBER@s.whatsapp.net",
  [
    {
      remoteJid: "WHATSAPP_NUMBER@s.whatsapp.net",
      id: "MESSAGE_ID",
      participant: "IF_GROUP_DEFINE_THIS",
    },
  ],
];
await client.method("readMessages", params); // will send a read
```

For a list of all the methods the api accept: https://whats2api.com/docs

## Events

Whats2Api send any updates, upserts, and notifications through the same endpoint, as POST: https://whats2api.com/docs/events

You can set any HTTP JSON compatible server you like to receive it, and there's a helper function to check for the event you want.

```js
client.on("messages.upsert", body, callback);
```

An more complete example:

```js
const express = require("express");
const createWhats2ApiClient = require("whats2api");
const app = express();

app.use(express.json());

const client = createWhats2ApiClient({
  email,
  password,
  connectionId,
});

app.post("/", async (req, res) => {
  const { body } = req;
  client.on("messages.upsert", body, (msg) => {
    console.log("An messages.upsert event has been received", msg);
  });

  res.send({ success: true });
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Waiting ${port}`);
});
```

## Helpers

Whatsapp data is complex and confusing, but we are providing here are some tools to sort it out:

### Check if message is of some kind

Important, this method ignores all the message types which are protocols, or just not usefull for most cases.

```js
const helpers = require('whats2api/helpers')
const msg = // msg came through an event or database
const isImg = helpers.msg.isImg(msg) // true/false
const isDoc = helpers.msg.isDoc(msg) // true/false
const isAudio = helpers.msg.isAudio(msg) // true/false
const isVideo = helpers.msg.isVideo(msg) // true/false
const isSticker = helpers.msg.isSticker(msg) // true/false
const isMedia = helpers.msg.isMedia(msg) // Object containing the true type
```

You can also just get the type.

```js
const helpers = require('whats2api/helpers')
const msg = // msg came through an event or database
const type = helpers.msg.getType(msg) // string
```

### Get the msg text

Most of the messages types can have text, use this method to extract it

```js
const helpers = require('whats2api/helpers')
const msg = // msg came through an event or database
const type = helpers.msg.getText(msg) // string|null
```
