const path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  common = require('../webpack.common.js');

module.exports = (mode) => {
  return merge(common(mode), {
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
      contentBase: path.join(__dirname, '../../www/'),
      // publicPath: path.join(__dirname, '../../www/assets/'),
      index: 'index.html',
      compress: true,
      open: true,
      port: 8080,
      hot: true,
      historyApiFallback: true,
    },
  });
};
