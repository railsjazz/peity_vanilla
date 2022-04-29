const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    //hot: true,
    disableHostCheck: true,
    host: '0.0.0.0',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'peity_vanilla',
      filename: 'index.html',
      template: './src/index.html',
      inject: false
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: 'peity_vanilla.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "umd"
  },
};