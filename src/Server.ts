
import http from 'http';

export default class Server {
    private server;

    constructor() {
        this.server = http.createServer();
    }

    public listen(port: number | string, callback: () => void) {
        this.server.listen(+port, callback);
    }
}