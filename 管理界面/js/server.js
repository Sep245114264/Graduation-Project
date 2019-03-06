const http = require('http');
const fs = require('fs');
//const url = require('url');
const { URL } = require('url');

const hostname = "127.0.0.1";
const port = 8888;

const server = http.createServer((req, res) => {
    let filename = req.url.sqlit('/').pop();
    console.log(filename);
    /*switch(req.url)
    {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-type', 'text/html');   
            fs.readFile('../index.html', 'utf-8', (err, data) => {
                if(err) throw err;
                res.write(data);
                res.end();
            });
            break;
        case '/css/style.css':
            res.statusCode = 200;
            res.setHeader('Content-type', 'text/html');   
            fs.readFile('../css/style.css', 'utf-8', (err, data) => {
                if(err) throw err;
                res.write(data);
                res.end();
            });
            break;
    }*/
});

server.listen(port, hostname, () => {
    console.log('ok');
})