const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');

module.exports = merge.smart(baseWebpackConfig, {
  mode: 'development',
  output: {
    filename: 'js/[name].[hash:8].js',
    publicPath: config.publicPath // 这里可以省略
  },
  module: {
    rules: [
      {
        oneOf: [
            {
                test: /\.(jpg|jpeg|bmp|png|webp|gif)$/,
                loader: 'url-loader',
                options: {
                  limit: 8 * 1024, // 小于这个大小的图片，会自动base64编码后插入到代码中
                  name: 'img/[name].[hash:8].[ext]',
                  outputPath: config.assetsDirectory,
                  publicPath: config.assetsRoot
                }
              },
              {
                exclude: [/\.(js|mjs|ts|tsx|less|css|jsx)$/, /\.html$/, /\.json$/],
                loader: 'file-loader',
                options: {
                  name: 'media/[path][name].[hash:8].[ext]',
                  outputPath: config.assetsDirectory,
                  publicPath: config.assetsRoot
                }
              }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: config.indexPath,
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    ...config.devServer
  },
  stats: {
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    builtAt: false,
    entrypoints: false,
    assets: false,
    version: false
  }
});
