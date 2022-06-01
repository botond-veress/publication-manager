import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';

const directories = {
  source: 'src',
  distribution: 'dist'
};

export default (env: unknown, { mode }: { mode: string }): webpack.Configuration => {
  const production = mode === 'production';

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? false : 'eval',
    entry: {
      app: path.resolve(directories.source, 'index.ts')
    },
    devServer: !production
      ? {
          compress: true,
          historyApiFallback: true,
          hot: true,
          host: '0.0.0.0',
          port: 3001
        }
      : undefined,
    output: {
      path: path.resolve(directories.distribution),
      filename: 'assets/scripts/[name].bundle.js',
      chunkFilename: 'assets/scripts/[id].chunk.js',
      clean: true
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.ts?$/,
          exclude: /node_modules/,
          options: {
            rootMode: 'upward'
          }
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(directories.source)
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(directories.source, 'index.html'),
        inlineSource: '.(js)$'
      }),
      ...(production ? [new HtmlInlineScriptPlugin()] : [])
    ]
  };
};
