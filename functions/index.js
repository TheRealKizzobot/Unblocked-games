const functions = require('firebase-functions');
const https = require('https');
const http = require('http');

exports.simpleProxy = functions
  .runWith({ timeoutSeconds: 30 }) // Optional: increase timeout
  .https.onRequest((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.set({
        'Access-Control-Allow-Origin': 'https://games.dkservers.space',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.status(204).send('');
      return;
    }

    const targetUrl = req.query.url;

    if (!targetUrl) {
      res.status(400).send('Please provide a URL to proxy.');
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl);
    } catch (error) {
      res.status(400).send('Invalid URL provided.');
      return;
    }

    // OPTIONAL: Whitelist domains to prevent abuse
    const allowedHosts = ['games.dkservers.space', 'unblocked.dkservers.space']; // Change these!
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      res.status(403).send('This domain is not allowed.');
      return;
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      },
    };

    const proxyReq = protocol.get(targetUrl, options, (targetRes) => {
      res.set({
        'Content-Type': targetRes.headers['content-type'] || 'text/plain',
        'Access-Control-Allow-Origin': 'https://games.dkservers.space',
      });
      res.status(targetRes.statusCode || 200);
      targetRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
      console.error('Error with the request:', error);
      res.status(500).send('Error making the request.');
    });
  });
