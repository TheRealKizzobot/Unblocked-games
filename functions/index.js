const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.proxy = functions.https.onRequest(async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Missing target URL parameter.');
    }

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' ? req.body : undefined,
            redirect: 'manual',
        });

        response.headers.forEach((value, name) => {
            res.setHeader(name, value);
        });

        const body = await response.buffer();
        res.status(response.status).send(body);

    } catch (error) {
        console.error('Error in proxy function:', error);
        res.status(500).send(`Proxy error: ${error.message}`);
    }
});
