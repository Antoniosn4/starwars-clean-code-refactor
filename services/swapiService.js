const https = require('https');
const { getCache, setCache } = require('../utils/cache');
const { log } = require('../utils/logger');

const STATUS_ERROR = 400;
let err_count = 0;
let timeout = 5000;
let debug_mode = true;

async function fetchData(endpoint) {
    const cached = getCache(endpoint);
    if (cached) {
        log(`Using cache for ${endpoint}`, debug_mode);
        return cached;
    }

    return new Promise((resolve, reject) => {
        let rawData = '';
        const req = https.get(`https://swapi.dev/api/${endpoint}`, { rejectUnauthorized: false }, (res) => {
            if (res.statusCode >= STATUS_ERROR) {
                err_count++;
                return reject(new Error(`Request failed with status ${res.statusCode}`));
            }

            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    setCache(endpoint, parsedData);
                    log(`Fetched ${endpoint}`, debug_mode);
                    resolve(parsedData);
                } catch (e) {
                    err_count++;
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            err_count++;
            reject(e);
        });

        req.setTimeout(timeout, () => {
            req.abort();
            err_count++;
            reject(new Error(`Request timeout for ${endpoint}`));
        });
    });
}

function configure({ debug, timeoutMs }) {
    debug_mode = debug;
    timeout = timeoutMs;
}

function getErrors() {
    return err_count;
}

module.exports = { fetchData, configure, getErrors };
