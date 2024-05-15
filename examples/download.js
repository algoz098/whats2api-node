import createWhats2ApiClient from '../src';
import fs from 'fs';

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
    try {
        console.log('Creating client');
        const client = createWhats2ApiClient({
            email,
            password,
            connectionId,
        });

        console.log('downloading...')
        const message = // an valid msg object containing the media received through event

        // now we have a message object, let's download the media
        const mediaArraybuffer = await client.downloadMedia(message);

        console.log('Saving to disk')
        // now we can save the media to a file to see it
        fs.writeFileSync('image.jpg', Buffer.from(mediaArraybuffer));

        console.log('Done');
    } catch (error) {
        console.error(error)
    }
}

main()