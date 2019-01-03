const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./base');


const prodConfig = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      name: true,
      cacheGroups: {
        common: {
          test: /[\\/]src[\\/]/,
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style@[contenthash].css",
      chunkFilename: "style@[contenthash].css"
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
    }),
  ],
};


module.exports = webpackMerge.smart(baseConfig, prodConfig);