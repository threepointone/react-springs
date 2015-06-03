import webpack from 'webpack';

let config = {
  devtool: 'source-map',
  target: 'web',
  entry: {
    index: ['./index.js']
  },
  output: {
    path: __dirname,
    filename: '[name].build.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: []
};

if(process.env.HOT){
  config = {
    ...config,
    devtool: 'eval',
    entry: Object.keys(config.entry).reduce((o, key) => ({...o, [key]: [
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server'
    ].concat(config.entry[key])}), {}),
    module: {...config.module,
      loaders: [{
        ...config.module.loaders[0],
        loaders: [
        'react-hot',
        'disto-hot'
        ].concat(config.module.loaders[0].loaders)
      }]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ].concat(config.plugins)
  };
}

module.exports = config;
