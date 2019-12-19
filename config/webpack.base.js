const path = require('path');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: config.assetsRoot,
    publicPath: config.publicPath
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        loader: 'eslint-loader',
        options: {
          emitWarning: true, // 这个配置需要打开，才能在控制台输出warning信息
          emitError: true, // 这个配置需要打开，才能在控制台输出error信息
          fix: true // 是否自动修复，如果是，每次保存时会自动修复可以修复的部分
        }
      },
        {
            oneOf: [
              {
                test: /\.(html)$/,
                loader: 'html-loader'
              },
              {
                test: /\.(j|t)sx?$/,
                include: path.resolve(__dirname, '../src'),
                use: [
                  {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                        '@babel/preset-react',  // jsx支持
                        '@babel/preset-env'
                      ],
                      plugins: [
                        '@babel/plugin-syntax-dynamic-import', // 这是新加入的项
                        ['@babel/plugin-proposal-class-properties', { 'loose': true }]// class中的箭头函数中的this指向组件
                      ],
                      cacheDirectory: true // 加快编译速度
                    }
                  },
                  {
                    loader: 'awesome-typescript-loader'
                  }
                ]
              },
              {
                test: /\.(less|css)$/,
                use: [
                  'style-loader',
                  'css-loader',
                  'postcss-loader',
                  {
                    loader: 'less-loader',
                    options: {
                      javascriptEnabled: true,
                    },
                  },
                ],
              },
              {
                test: /\.(s[ac]ss|css)$/,
                use: [
                  'style-loader',
                  'css-loader',
                  {
                    loader: 'postcss-loader',
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      javascriptEnabled: true,
                    },
                  }
                ]
              },
              {
                test: /\.svg$/,
                use: ['@svgr/webpack']
              },
            ]
          }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
     '@': path.resolve(__dirname, '../src/'), // 以 @ 表示src目录
     'src': path.resolve(__dirname, '../src/')
    }
   },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: config.indexPath,
      showErrors: true
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: true ? { map: { inline: false }} : {}
      })
    ]
  }
};
