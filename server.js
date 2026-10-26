const http = require('http');
const axios = require('axios');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    // 1. Parse the incoming complex URL
    const parsedUrl = url.parse(req.url, true);
    const queryString = parsedUrl.search || '';

    // 2. Look for common website indicators (like .com, .net, .org) inside the noise
    const urlMatch = queryString.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,6})/);

    if (!urlMatch) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to your custom gateway server. No target destination detected in the URL query.');
    }

    // 3. Extract the target website
    const targetSite = 'https://' + urlMatch[0];

    try {
        // 4. Fetch the target website as the server proxy
        const response = await axios.get(targetSite, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        // 5. Send the website data back to your browser
        res.writeHead(200, { 'Content-Type': response.headers['content-type'] || 'text/html' });
        res.end(response.data);

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Proxy Error: Unable to fetch target destination. Details: ${error.message}`);
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

