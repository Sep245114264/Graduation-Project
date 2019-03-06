const http = require('http');
const fs = require('fs');
//const url = require('url');
const { URL } = require('url');
const querystring = require('querystring');

const hostname = "127.0.0.1";
const port = 8888;

const server = http.createServer((req, res) => {
    let url = new URL(req.url, `http://${hostname}`);
    let pathname = url.pathname;
    let filename = pathname.split('/').pop();
    let suffix = filename.split('.').pop();
    let search = url.search.substring(1);
    if(req.method === 'GET')
    {
        switch(suffix)
        {
            case '':
                res.writeHead(200, {"Content-type": "text/html"});
                fs.readFile('index.html', 'utf-8', (err, data) => {
                    res.write(data);
                    res.end();
                });
                break;
            case 'css':
                res.writeHead(200, {"Content-type": "text/css"});
                fs.readFile('.' + pathname, 'utf-8', (err, data) => {
                    res.write(data);
                    res.end();
                });
                break;
            case 'js': 
                res.writeHead(200, {"Content-type": "text/js"});
                fs.readFile('.' + pathname, 'utf-8', (err, data) => {
                    res.write(data);
                    res.end();
                });
                break;
            case 'ico':
                break;
            case 'png':
            case 'jpg':
                res.writeHead(200, {"Content-type": "image/jpeg"});
                fs.readFile('.' + pathname, (err, data) => {
                    res.write(data);
                    res.end();
                });
                break;
            case 'data':
                console.log(querystring.parse(search));
                break;
            default:
                fs.readFile('.' + pathname + '.html', 'utf-8', (err, data) => {
                    if(err) 
                    {
                        res.writeHead(404, {"Content-type": "text/html"});
                        res.write('404');
                        res.end();
                    }
                    else
                    {
                        res.writeHead(200, {"Content-type": "text/html"});
                        res.write(data);
                        res.end();
                    }
                });
                break;
        }
    }
    else if( req.method === 'POST' )
    {
        let data = '';
        req.on ('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            console.log(data);
            res.writeHead(200, {'Content-type': 'text/html'});
            fs.readFile('./mainControl.html', (err, data) => {
                res.write(data);
                res.end();
            });
        });
    }
});

server.listen(port, hostname, () => {
    console.log('ok');
})