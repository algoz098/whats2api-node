const createWhats2ApiClient = require('../src/index');
const argv = process.argv;

const emailCmd = argv.find(e => e.includes('--email'));
const connectionIdCmd = argv.find(e => e.includes('--connection'));
const passwordCmd = argv.find(e => e.includes('--password'));
const targetJid = argv.find(e => e.includes('--jid'));
const textCmd = argv.find(e => e.includes('--text'));

if (!emailCmd) throw new Error('No email provided');
if (!connectionIdCmd) throw new Error('No connection id provided');
if (!passwordCmd) throw new Error('No password provided');
if (!targetJid) throw new Error('No target jid provided');

const email = emailCmd.replace('--email=', '');
const connectionId = connectionIdCmd.replace('--connection=', '');
const password = passwordCmd.replace('--password=', '');
const jid = targetJid.replace('--jid=', '');
const text = textCmd ? textCmd.replace('--text=', '') : 'Hello!';

async function main() {
    console.log('Creating client');
    const client = createWhats2ApiClient({
        email,
        password,
        connectionId,
    });
    console.log('sending message...')
    const msg = await client.sendMessage(jid, text);
    console.log('reply to message...')
    await client.sendMessage(jid, text, {
        quoted: msg
    });
    console.log('Sending quote...')
    await client.sendMessage(jid, `@${jid.split('@')[0]} ${text}`, { mentions: [jid] });

    console.log('Sending location...')
    await client.sendLocation(jid, {
        lat: 24.121231,
        lng: 55.1121221
    });
    
    console.log('Sending contact...')
    await client.sendContact(jid, {
        "contacts": {
          "displayName": "Jeff",
          "contacts": [
            {
              "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:Jeff Singh\nORG:Ashoka Uni;\nTEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\nEND:VCARD"
            }
          ]
        }
      });
    console.log('Sending reaction...')
    await client.sendReaction(jid, {
        text: '💖',
        key: msg.key
    });

    console.log('Done');
}

main()