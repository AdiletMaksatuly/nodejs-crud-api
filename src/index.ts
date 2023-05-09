import * as dotenv from 'dotenv';
import Server from './Server.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = new Server();

server.listen(PORT, () => console.log('Server is listening on port: ' + PORT));