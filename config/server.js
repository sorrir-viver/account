// http://expressjs.com/pt-br/advanced/best-practice-performance.html
// https://www.npmjs.com/package/serverless-api-compression
// https://github.com/awslabs/aws-serverless-express/issues/99
const path = require('path'),
  express = require('express'),
  awsServerlessExpress = require('aws-serverless-express');

const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express(),
  mimeTypes = [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/x-font-ttf',
    'application/x-font-woff',
    'application/font-woff',
    'application/font-woff2',
    'application/xml',
    'font/eot',
    'font/woff',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/x-icon',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml',
  ];

app.use(awsServerlessExpressMiddleware.eventContext());

app.get('/event', (req, res) => {
  res.json(req.apiGateway.event);
});

// https://expressjs.com/pt-br/starter/static-files.html
app.use('/assets', express.static(path.join(__dirname, '../www/assets')));

// https://stackoverflow.com/questions/49961731/react-router-4-and-express-cannot-get
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../www', 'index.html'));
});

const server = awsServerlessExpress.createServer(app, null, mimeTypes);

exports.handler = function(event, context) {
  return awsServerlessExpress.proxy(server, event, context);
};
