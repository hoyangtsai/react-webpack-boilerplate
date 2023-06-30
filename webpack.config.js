const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const openBrowser = require('react-dev-utils/openBrowser')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    // Where files should be sent once they are bundled
    output: {
      path: path.join(__dirname, '/dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].bundle.js',
      chunkFilename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
      assetModuleFilename: 'assets/[contenthash:8][ext]',
    },
    // webpack 5 comes with devServer which loads in development mode
    devServer: {
      port: 3000,
      watchFiles: ['src/**/*'],
      historyApiFallback: true,
      onListening: function (devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        const addr = devServer.server.address();
        const url = addr.address === '::' ? '0.0.0.0' : addr.address;
        openBrowser(`http://${url}:${addr.port}`);
      },
    },
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
              }
            },
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDevelopment
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ["autoprefixer"]
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment
              }
            }
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ["autoprefixer"]
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|json)$/i,
          type: 'asset/resource',
        },
      ]
    },
    optimization: {
      chunkIds: 'named',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            chunks: 'initial'
          },
          commons: {
            name: 'commons',
            minChunks: 3, // minimum common number
            priority: 5,
            reuseExistingChunk: true
          },
          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.nameForCondition() || '')
              )
            },
            name(module) {
              const packageNameArr = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = packageNameArr ? packageNameArr[1] : '';
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `lib.${packageName.replace("@", "")}`;
            },
            priority: 15,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: {
        name: 'runtime',
      },
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            toplevel: true,
            output: { ascii_only: true },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React App',
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
      }),
      new ESLintPlugin()
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {}
    }
  }
}

