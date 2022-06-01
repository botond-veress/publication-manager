/* eslint-disable @typescript-eslint/no-var-requires */

const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: slsw.lib.webpack.isLocal ? false : 'source-map',
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: !slsw.lib.webpack.isLocal
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  externalsPresets: { node: true },
  externals: [nodeExternals({ allowlist: /@botondveress/, additionalModuleDirs: ['../../node_modules'] })],
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.ts$/,
        exclude: /node_modules/,
        options: {
          rootMode: 'upward'
        }
      }
    ]
  }
};
