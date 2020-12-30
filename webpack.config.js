const path = require('path')
//const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

// "scripts": {
//   "dev": "cross-env NODE_ENV=development webpack --mode development",
//     "build": "cross-env NODE_ENV=production webpack --mode production",
//     "watch": "cross-env NODE_ENV=development webpack --mode development --watch",
//     "start": "cross-env NODE_ENV=development webpack serve --mode development"
// },

// const cssLoaders = extra => {
//   const loaders = [
//     {
//       loader: MiniCssExtractPlugin.loader,
//       options: {
//         publicPath: path.resolve(__dirname, 'dist'),
//       },
//     },
//     'css-loader'
//   ]
//   if (extra) {
//     loaders.push(extra)
//   }
//   return loaders;
// }
//
//
// if (isDev) {
//   // only enable hot in development
//   plugins.push(new webpack.HotModuleReplacementPlugin());
// }

//Смотреть lesson 16

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core')
    }
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 3000,
    open: true,
    hot: isDev
    // historyApiFallback: true,
    // contentBase: path.resolve(__dirname, './dist'),
    // open: true,
    // compress: true,
    // hot: true,
    // port: 8080,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   // hmr: isDev,
            //   reloadAll: true,
            //   publicPath: path.resolve(__dirname, 'dist')
            // }
          },
          'css-loader',
          'sass-loader',
        ],
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }
    ],
  }
}