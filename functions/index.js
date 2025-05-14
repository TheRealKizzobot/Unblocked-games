const functions = require('firebase-functions');
const https = require('https'); // For secure websites
const http = require('http'); // For regular websites

exports.simpleProxy = functions.https.onRequest((req, res) => {
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

	const protocol = parsedUrl.protocol === 'https:' ? https : http;

	protocol.get(targetUrl, (targetRes) => {
		let data = '';
		targetRes.on('data', (chunk) => {
			data += chunk;
		});
		targetRes.on('end', () => {
			res.set({
				'Content-Type': targetRes.headers['content-type'],
				// Important: Only allow your own site!
				'Access-Control-Allow-Origin': 'https://games.dkservers.space',
			});
			res.status(targetRes.statusCode);
			res.send(data);
		});
		targetRes.on('error', (error) => {
			console.error('Error fetching URL:', error);
			res.status(500).send('Failed to fetch the requested URL.');
		});
	}).on('error', (error) => {
		console.error('Error with the request:', error);
		res.status(500).send('Error making the request.');
	});
});