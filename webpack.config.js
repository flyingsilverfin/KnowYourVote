var webpack = require('webpack');
var path = require('path');
/*
module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index.jsx'
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
        } 
        //, { test: /\.json$/, loader: 'json' } 
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
*/

module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/client/src/app.jsx'),

  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'bundle.js'
  },

  module: {

    // apply loaders to files that meet given conditions
    loaders: [{
        test: /\.jsx?$/,
        include: path.join(__dirname, '/client/src'),
        loader: 'babel',
        exclude: /node_modules/,
        query: {
            presets: ["es2015", "react"]
        }
    }]
  },

  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: true
}