import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  mode: 'development',
  entry: './main.jsx',
  devtool: 'inline-source-map',
  output: {
  path: path.join(__dirname, '/dist'),
  filename: 'bundle.js'
  },
  devServer: {
  static: './dist',
  },
  module: {
  rules: [
  {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
  },
  ]
  },
  resolve: {
  extensions: ['.jsx', '.ts', '.js', '.scss'],
  },
  plugins:[
  new HtmlWebpackPlugin({
  template: './index.html',
  publicPath: "/"
  })
  ]
}