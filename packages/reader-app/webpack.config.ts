import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import * as yup from 'yup';
import dotenv from 'dotenv';

const directories = {
  source: 'src',
  distribution: 'dist'
};

const schema = yup.object({
  ALGOLIA_APP_ID: yup.string().required(),
  ALGOLIA_API_KEY: yup.string().required(),
  ALGOLIA_INDEX_PUBLICATION: yup.string().required(),
  ALGOLIA_INDEX_PUBLICATION_CONTENT: yup.string().required(),
  ALGOLIA_INDEX_PUBLICATION_SUGGESTION: yup.string().required()
});

const validateConfiguration = <S extends yup.ObjectSchema<any>>(environment: yup.InferType<S>, schema: S) => {
  try {
    return schema.validateSync(environment, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(`Environment validation errors occured: ${error.errors.join(', ')}`);
    }
    throw error;
  }
};

export default (env: unknown, { mode }: { mode: string }): webpack.Configuration => {
  const production = mode === 'production';

  dotenv.config({ path: `.env.${production ? 'prod' : 'dev'}` });

  const config = validateConfiguration(process.env as any, schema);

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'eval',
    entry: {
      app: path.resolve(directories.source, 'index.tsx')
    },
    devServer: !production
      ? {
          compress: true,
          historyApiFallback: true,
          hot: true,
          host: '0.0.0.0',
          port: 3000
        }
      : undefined,
    output: {
      path: path.resolve(directories.distribution),
      filename: 'assets/scripts/[name].[contenthash].js',
      chunkFilename: 'assets/scripts/[id].chunk.js',
      clean: true
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.tsx?$/,
          exclude: /node_modules/,
          options: {
            rootMode: 'upward',
            plugins: production ? [] : ['react-refresh/babel']
          }
        },
        {
          test: /\.css$/,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  config: `${__dirname}/postcss.config.js`
                }
              }
            }
          ]
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
        template: path.join(directories.source, 'index.html')
      }),
      ...(production
        ? [
            new MiniCssExtractPlugin({
              filename: 'assets/stylesheets/[name].[contenthash].css',
              chunkFilename: 'assets/stylesheets/[id].css'
            })
          ]
        : [new ReactRefreshWebpackPlugin()]),
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(config)
      })
    ],
    optimization: {
      minimizer: [
        `...`,
        ...(production
          ? [
              new CssMinimizerPlugin({
                minimizerOptions: {
                  preset: ['default', { discardComments: { removeAll: true } }]
                }
              })
            ]
          : [])
      ]
    }
  };
};
