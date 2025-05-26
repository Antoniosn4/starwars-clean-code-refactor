const { fetchData } = require('../services/swapiService');

async function handleApiRequest() {
    try {
        const people = await fetchData('people/1');
        const starships = await fetchData('starships/?page=1');
        const planets = await fetchData('planets/?page=1');
        const films = await fetchData('films/');

        return {
            people,
            starships,
            planets,
            films
        };
    } catch (error) {
        throw new Error(`API fetch error: ${error.message}`);
    }
}

module.exports = { handleApiRequest };
