const createWhats2ApiClient = require( '../src');
const path = require( 'path');
const argv = process.argv;

const emailCmd = argv.find(e => e.includes('--email'));
const connectionIdCmd = argv.find(e => e.includes('--connection'));
const passwordCmd = argv.find(e => e.includes('--password'));
const targetJid = argv.find(e => e.includes('--jid'));
const urlCmd = argv.find(e => e.includes('--url'));

if (!emailCmd) throw new Error('No email provided');
if (!connectionIdCmd) throw new Error('No connection id provided');
if (!passwordCmd) throw new Error('No password provided');
if (!targetJid) throw new Error('No target jid provided');

const email = emailCmd.replace('--email=', '');
const connectionId = connectionIdCmd.replace('--connection=', '');
const password = passwordCmd.replace('--password=', '');
const jid = targetJid.replace('--jid=', '');

async function main() {
    console.log('Creating client');
    const client = createWhats2ApiClient({
        baseUrl: 'http://192.168.1.220:3030',
        email,
        password,
        connectionId,
    });

    // const mp4Url = 'https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/04/file_example_MP4_480_1_5MG.mp4'
    // console.log('sending gif...')
    // // caption is optional
    // await client.sendGif(jid, {url: mp4Url, caption: 'Hello World'});
    
    // console.log('sending video...')
    // // caption is optional
    // await client.sendVideo(jid, {url: mp4Url, mimetype: 'video/mp4', fileName: 'video.mp4',  caption: 'Hello World'});

    // const jpgUrl = 'https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/10/file_example_JPG_100kB.jpg'
    const filepath = path.resolve(__dirname, 'example.jpg')
    console.log('sending image...', filepath)
    // caption is optional
    let res = await client.sendImg(jid, {filepath, caption: 'Hello World'});

    // const audioUrl = 'https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/11/file_example_MP3_700KB.mp3'
    // console.log('sending audio...')
    // // there is no caption for audio
    // await client.sendAudio(jid, {url: audioUrl, mimetype: 'audio/mp3', fileName: 'audio.mp3'});

    // const docUrl = 'https://file-examples.com/storage/fea5418a9e6643f30985b20/2017/10/file-sample_150kB.pdf'
    // console.log('sending document...')
    // // caption is optional
    // await client.sendDoc(jid, {url: docUrl, mimetype: 'application/pdf', fileName: 'document.pdf', caption: 'Hello World'});

    console.log('Done', res);
}

main()