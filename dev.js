import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';

const isHot = !!process.env.HOT;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: isHot,
  historyApiFallback: true
}).listen(3000, 'localhost', err => console.log(err || 'webpack at localhost:3000'));
