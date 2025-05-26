const cache = {};

function getCache(key) {
    return cache[key];
}

function setCache(key, value) {
    cache[key] = value;
}

function getCacheSize() {
    return Object.keys(cache).length;
}

module.exports = { getCache, setCache, getCacheSize };
 


