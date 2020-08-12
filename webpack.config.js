module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude:/node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}