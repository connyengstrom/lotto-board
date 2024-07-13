
const path = require('path');
const express = require('express');
const webpack = require('webpack');

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.js');
const chalk = require('chalk');
const compiler = webpack(webpackConfig);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/correctrow', async (req, res) => {
    setTimeout(() => {
        res.json({ correctRow: [12, 22, 13, 24, 18, 43, 5, 32, 25, 47]});
    }, 500);
});

app.listen(3000, function () {
  const serverUrl = chalk.blue.bold.underline('http://localhost:3000/');
  const message = chalk.green.bold('Server started!');

  console.log(`${message}\n\nOpen ${serverUrl} in your browser.`);
});
