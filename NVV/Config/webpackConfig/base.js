const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


const config = {
  entry: {
    index: ['./src/index.js'],
    vendors: [
      'react',
      'react-dom',
      'moment',
      'mobx',
      'mobx-react',
      'rc-menu',
      'rc-notification',
      'rc-tooltip',
      'rc-select',
      'rc-table',
    ]
  },
  output: {
    path: path.resolve(process.cwd(), './release'),
    publicPath: './',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]-[hash:base64:5]'
            }
          },
          "less-loader",
        ],
        exclude: /style/,
        include: /src/
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader',
        include: /style/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?{"modules":true}'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template/index.html'
    }),
  ],
};


module.exports = config;