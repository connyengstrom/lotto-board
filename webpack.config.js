const path = require('path');

const entries = {
	'app.js': [path.join(__dirname, 'src', 'app.jsx')],
	'style.js': [path.join(__dirname, 'src', 'style.less')]
};

module.exports = {
  mode: 'development',
  entry: entries,
  devtool: 'inline-source-map',
	resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    filename: '[name]',
    path: path.join(__dirname, 'public'),
    publicPath: '/'
  },
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
			{
				test: /\.(js|jsx)$/i,
				exclude: /(node_modules)/,
				loader: "babel-loader",
				options: { presets: ["@babel/env"] }
			},
			{
				test: /\.less$/i,
				use: [
					"style-loader",
					"css-loader",
					"less-loader",
				],
			}
		]
  }
};