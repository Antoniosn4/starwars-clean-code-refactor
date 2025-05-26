const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRequest } = require('./controllers/apiController');
const { configure, getErrors } = require('./services/swapiService');
const { getCacheSize } = require('./utils/cache');

const PORT = process.env.PORT || 3000;
const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;

const args = process.argv.slice(2);
let debug = !args.includes('--no-debug');
let timeout = 5000;
if (args.includes('--timeout')) {
    const idx = args.indexOf('--timeout');
    if (idx >= 0 && idx < args.length - 1) {
        timeout = parseInt(args[idx + 1]);
    }
}

configure({ debug, timeout });

const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Server Error');
            } else {
                res.writeHead(STATUS_OK, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else if (req.url === '/api') {
        try {
            await handleApiRequest();
            res.writeHead(STATUS_OK, { 'Content-Type': 'text/plain' });
            res.end('Check server console for results');
        } catch (e) {
            res.writeHead(500);
            res.end('API Error: ' + e.message);
        }
    } else if (req.url === '/stats') {
        res.writeHead(STATUS_OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            cache_size: getCacheSize(),
            errors: getErrors(),
            debug,
            timeout
        }));
    } else {
        res.writeHead(STATUS_NOT_FOUND);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
