const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js代码
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const config = require('./config');

module.exports = merge.smart(baseWebpackConfig, {
  mode: 'production',
  devtool: 'cheap-source-map',
  entry: {
    app: './src/index.tsx',
    vendor: ['react', 'react-dom'] // 不变的代码分包
  },
  output: {
    filename: 'js/[name].[contenthash:8].js', // contenthash：只有模块的内容改变，才会改变hash值
  },
  module: {
    rules: [
      {
        oneOf: [
            {
                test: /\.(less|css)$/,
                use: [
                  MiniCssExtractPlugin.loader, // 注意书写的顺序
                  'css-loader',
                  'postcss-loader',
                  {
                    loader: 'less-loader',
                    options: {
                      javascriptEnabled: true,
                    }
                  }
                ]
            },
            {
                test: /\.(s[ca]ss|css)$/,
                use: [
                  MiniCssExtractPlugin.loader, // 注意书写的顺序
                  'css-loader',
                  'postcss-loader',
                  {
                    loader: 'sass-loader',
                    options: {
                      javascriptEnabled: true,
                    }
                  }
                ]
            },
            {
                test: /\.(jpg|jpeg|bmp|png|webp|gif)$/,
                loader: 'url-loader',
                options: {
                  limit: 8 * 1024, // 小于这个大小的图片，会自动base64编码后插入到代码中
                  name: 'img/[name].[contenthash:8].[ext]',
                  outputPath: config.assetsDirectory,
                  publicPath: config.assetsRoot
                }
              },
              {
                exclude: [/\.(js|mjs|ts|tsx|less|css|jsx)$/, /\.html$/, /\.json$/],
                loader: 'file-loader',
                options: {
                  name: 'media/[path][name].[contenthash:8].[ext]',
                  outputPath: config.assetsDirectory,
                  publicPath: config.assetsRoot
                }
              }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      },
      include: ['app']
    }),
    new HtmlWebpackPlugin({
        template: config.indexPath,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeOptionalTags: false,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }
    }),
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
    }),
    new CompressionWebpackPlugin({ //gzip压缩
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(js|css)$'),
        threshold: 10240, // 大于这个大小的文件才会被压缩
        minRatio: 0.8
    }),
  ],
  optimization: {
    minimizer: [
        new UglifyjsWebpackPlugin({
          sourceMap: config.productionJsSourceMap
        }),
        new TerserPlugin({
            sourceMap: config.productionJsSourceMap
        })
    ], 
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      maxInitialRequests: 5,
      cacheGroups: {
        // 提取公共模块
        commons: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: 'common'
        }
      }
    }
  }
});

