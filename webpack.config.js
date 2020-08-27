const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'mediaCarrier',
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
