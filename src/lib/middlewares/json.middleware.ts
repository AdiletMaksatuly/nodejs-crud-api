import http from "http";

export const json = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, {
        'Content-type': 'application/json'
    });

    const originalEnd = res.end;

    // @ts-ignore
    res.end = function(data, encoding, callback) {
        if (data && typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        originalEnd.call(this, data, encoding, callback);
    };
}