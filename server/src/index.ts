import * as http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import path from 'path';

const port = Number(process.env.PORT || 8000) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', '..', 'dist')));

server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${(server.address() as AddressInfo).port}`);
});
