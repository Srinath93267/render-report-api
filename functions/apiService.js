const axios = require('axios');
const API_URLS = require('./config');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

async function getPortfolioPerformanceData(Account) {
    try {
        const response = await axios.get(API_URLS.GETPORTFOLIOPERFORMANCEDATA, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_URLS.apiSecretKey,
                'ACCOUNT': Account
            },
            httpsAgent: agent // Attach the custom agent to bypass SSL
        });
        return response.data; // Handle response
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

async function getAssetAllocationData(Account) {
    try {
        const response = await axios.get(API_URLS.GETASSETALLOCATIONDATA, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_URLS.apiSecretKey,
                'ACCOUNT': Account
            },
            httpsAgent: agent // Attach the custom agent to bypass SSL
        });
        return response.data; // Handle response
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

module.exports = { getPortfolioPerformanceData, getAssetAllocationData };