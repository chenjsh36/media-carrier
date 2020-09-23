const path = require('path');

module.exports = {
  mode: 'production',
  devtool: "source-map",
  entry: {
    index: './src/index.ts',
  },
  output: {
    // path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'mediaCarrier',
    libraryTarget: "umd"
  },
  optimization: {
    // 这个选项开启后会影响 ts sourcemap 的生成，调试了半天也不懂是为什么。
    occurrenceOrder: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },      
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  }
};
