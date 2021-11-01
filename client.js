const http = require('http');

http.get({
    port: 3000,
    hostname: 'localhost',
    path: '/products',
    headers: {
        authorization: 'secretpassword'
    }
}, (res) => {
    console.log("connected");
    var chunks = [];
    res.on("data", (chunk) => {
        console.log("chunk", "" + chunk);
        chunks.push(chunk);
    });
    res.on("end", () => {
        console.log("No more data");
        var wholeBody = chunks.join('');
        console.log(wholeBody);

    });
    res.on("close", () => {
        console.log("Closing connection");
    });
});