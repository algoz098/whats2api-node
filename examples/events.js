const createWhats2ApiClient = require('../src/index');
const express = require('express');
const argv = process.argv;

const emailCmd = argv.find(e => e.includes('--email'));
const connectionIdCmd = argv.find(e => e.includes('--connection'));
const passwordCmd = argv.find(e => e.includes('--password'));
const targetJid = argv.find(e => e.includes('--jid'));
const textCmd = argv.find(e => e.includes('--text'));
const port = process.env.PORT || 3031;

if (!emailCmd) throw new Error('No email provided');
if (!connectionIdCmd) throw new Error('No connection id provided');
if (!passwordCmd) throw new Error('No password provided');
if (!targetJid) throw new Error('No target jid provided');

const email = emailCmd.replace('--email=', '');
const connectionId = connectionIdCmd.replace('--connection=', '');
const password = passwordCmd.replace('--password=', '');

const app = express();

app.use(express.json());

async function main() {
    console.log('Creating client');
    const client = createWhats2ApiClient({
        email,
        password,
        connectionId,
    });

    app.post('/', async (req, res) => {
        const {
            body
        } = req
        client.on('messages.upsert', body, (msg) => {
            console.log('An messages.upsert event has been received', msg)    
        });

        res.send({success: true});

    })
    
    app.use((req, res) => {
        res.status(404).send('404 Not Found');
    });

    app.listen(port, () => {
        console.log(`Waiting ${port}`);
    });
}

main()