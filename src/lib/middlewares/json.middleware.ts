import http from "http";

export const json = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, {
        'Content-type': 'application/json'
    });

    const originalEnd = res.end;

    // @ts-ignore
    res.end = function(data, encoding, callback) {
        if (data && typeof data !== 'string') {
            // Convert the response body to JSON string
            data = JSON.stringify(data);
        }

        // Call the original res.end() with the updated arguments
        originalEnd.call(this, data, encoding, callback);
    };
}