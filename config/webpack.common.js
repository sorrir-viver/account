const path = require('path'),
  Dotenv = require('dotenv-webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin');

const ImageminPlugin = require('imagemin-webpack'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  imageminPngquant = require('imagemin-pngquant'),
  imageminSvgo = require('imagemin-svgo');

const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

module.exports = (mode) => {
  return {
    devtool: 'source-map',
    mode: mode,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, '../www', 'assets/js/'),
      filename: '[hash:12].js',
      // https://stackoverflow.com/questions/34620628/htmlwebpackplugin-injects-relative-path-files-which-breaks-when-loading-non-root
      // publicPath: mode === 'development' ? '/' : '/assets/js/',
      chunkFilename: '[chunkhash:12].js',
    },
    optimization: {
      // https://webpack.js.org/plugins/split-chunks-plugin/
      splitChunks: {
        chunks: 'async',
        maxSize: 600000,
        minChunks: 5,
        maxAsyncRequests: 19,
        maxInitialRequests: 19,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                'es2015',
                {
                  modules: false,
                },
              ],
              'stage-2',
              'react',
            ],
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 50000,
            },
          },
        },
        {
          test: /\.(png|jp(e*)g|svg)$/,
          use: [
            {
              loader: 'url-loader',
            },
            {
              loader: ImageminPlugin.loader,
              options: {
                bail: false, // Ignore errors on corrupted images
                cache: true,
                imageminOptions: {
                  plugins: [imageminMozjpeg(), imageminPngquant(), imageminSvgo()],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: mode === 'development' ? 'index.html' : '../../index.html',
        showErrors: true,
        chunksSortMode: 'dependency',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new Dotenv({
        path: path.join(__dirname, '/' + mode + '/.env'),
        safe: false,
        systemvars: false,
        silent: false,
      }),
      // new PrepackWebpackPlugin({}),
      new ProgressBarPlugin({
        format: 'Build [:bar] :percent (:elapsed seconds)',
        clear: false,
      }),
    ],
  };
};
