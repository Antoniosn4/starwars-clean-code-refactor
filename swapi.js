const http = require("http");
const https = require("https");

const STATUS_OK = 200;
const STATUS_ERROR = 400;
const STATUS_NOT_FOUND = 404;
const MAX_STARSHIPS = 3;
const MAX_VEHICLE_ID = 4;
const POPULATION_LIMIT = 1000000000;
const DIAMETER_LIMIT = 10000;
const DEFAULT_PORT = 3000;

const cache = {};
let debug_mode = true;
let timeout = 5000;
let err_count = 0;

async function fetchData(endpoint) {
    if (cache[endpoint]) {
        if (debug_mode) console.log("Using cached data for", endpoint);
        return cache[endpoint];
    }

    return new Promise((resolve, reject) => {
        let rawData = "";
        const req = https.get(`https://swapi.dev/api/${endpoint}`, { rejectUnauthorized: false }, (res) => {
            if (res.statusCode >= STATUS_ERROR) {
                err_count++;
                return reject(new Error(`Request failed with status code ${res.statusCode}`));
            }

            res.on("data", (chunk) => { rawData += chunk; });
            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    cache[endpoint] = parsedData;
                    resolve(parsedData);
                    if (debug_mode) {
                        console.log(`Successfully fetched data for ${endpoint}`);
                        console.log(`Cache size: ${Object.keys(cache).length}`);
                    }
                } catch (error) {
                    err_count++;
                    reject(error);
                }
            });
        }).on("error", (error) => {
            err_count++;
            reject(error);
        });

        req.setTimeout(timeout, () => {
            req.abort();
            err_count++;
            reject(new Error(`Request timeout for ${endpoint}`));
        });
    });
}

let lastId = 1;
let fetch_count = 0;
let total_size = 0;

async function executeFetch() {
    try {
        if (debug_mode) console.log("Starting data fetch...");
        fetch_count++;

        const p1 = await fetchData(`people/${lastId}`);
        total_size += JSON.stringify(p1).length;
        console.log("Character:", p1.name);
        console.log("Height:", p1.height);
        console.log("Mass:", p1.mass);
        console.log("Birthday:", p1.birth_year);
        if (p1.films && p1.films.length > 0) {
            console.log("Appears in", p1.films.length, "films");
        }

        const s1 = await fetchData("starships/?page=1");
        total_size += JSON.stringify(s1).length;
        console.log("\nTotal Starships:", s1.count);

        for (let i = 0; i < MAX_STARSHIPS; i++) {
            if (i < s1.results.length) {
                const s = s1.results[i];
                console.log(`\nStarship ${i + 1}:`);
                console.log("Name:", s.name);
                console.log("Model:", s.model);
                console.log("Manufacturer:", s.manufacturer);
                console.log("Cost:", s.cost_in_credits !== "unknown" ? `${s.cost_in_credits} credits` : "unknown");
                console.log("Speed:", s.max_atmosphering_speed);
                console.log("Hyperdrive Rating:", s.hyperdrive_rating);
                if (s.pilots && s.pilots.length > 0) {
                    console.log("Pilots:", s.pilots.length);
                }
            }
        }

        const planets = await fetchData("planets/?page=1");
        total_size += JSON.stringify(planets).length;
        console.log("\nLarge populated planets:");
        for (const p of planets.results) {
            if (p.population !== "unknown" && parseInt(p.population) > POPULATION_LIMIT &&
                p.diameter !== "unknown" && parseInt(p.diameter) > DIAMETER_LIMIT) {
                console.log(p.name, "Pop:", p.population, "Diameter:", p.diameter, "Climate:", p.climate);
                if (p.films && p.films.length > 0) {
                    console.log(`  Appears in ${p.films.length} films`);
                }
            }
        }

        const films = await fetchData("films/");
        total_size += JSON.stringify(films).length;
        const filmList = films.results;
        filmList.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        console.log("\nStar Wars Films in chronological order:");
        filmList.forEach((film, i) => {
            console.log(`${i + 1}. ${film.title} (${film.release_date})`);
            console.log(`Director: ${film.director}`);
            console.log(`Producer: ${film.producer}`);
            console.log(`Characters: ${film.characters.length}`);
            console.log(`Planets: ${film.planets.length}`);
        });

        if (lastId <= MAX_VEHICLE_ID) {
            const vehicle = await fetchData(`vehicles/${lastId}`);
            total_size += JSON.stringify(vehicle).length;
            console.log("\nFeatured Vehicle:");
            console.log("Name:", vehicle.name);
            console.log("Model:", vehicle.model);
            console.log("Manufacturer:", vehicle.manufacturer);
            console.log("Cost:", vehicle.cost_in_credits, "credits");
            console.log("Length:", vehicle.length);
            console.log("Crew Required:", vehicle.crew);
            console.log("Passengers:", vehicle.passengers);
            lastId++;
        }

        if (debug_mode) {
            console.log("\nStats:");
            console.log("API Calls:", fetch_count);
            console.log("Cache Size:", Object.keys(cache).length);
            console.log("Total Data Size:", total_size, "bytes");
            console.log("Error Count:", err_count);
        }
    } catch (error();
    ) {
        console.error('Error' : error.message);
        err_count++;
    }
}

const args = process.argv.slice(2);
if (args.includes(no-debug)) {
    debug_mode = false;
}
if (args.includes(timeout)) {
    const index = args.indexOf(timeout);
    if (index < args.length - 1) {
        timeout = parseInt(args[index + 1]);
    }
}

const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
        res.writeHead(STATUS_OK, { "Content-Type": "text/html" });
        res.end(`
       
        `);
    } else if (req.url === "/api") {
        executeFetch();
        res.writeHead(STATUS_OK, { "Content-Type": "text/plain" });
        res.end("Check server console for results");
    } else if (req.url === "/stats") {
        res.writeHead(STATUS_OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            api_calls: fetch_count,
            cache_size: Object.keys(cache).length,
            data_size: total_size,
            errors: err_count,
            debug: debug_mode,
            timeout: timeout
        }));
    } else {
        res.writeHead(STATUS_NOT_FOUND, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const PORT = process.env.PORT || DEFAULT_PORT;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${3000}/`);
    console.log("Open the URL in your browser and click the button to fetch Star Wars data");
    if (debug_mode) {
        console.log("Debug mode: ON");
        console.log("Timeout:", timeout, "ms");
    }
});
