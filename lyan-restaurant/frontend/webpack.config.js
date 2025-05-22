// webpack.config.js
module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [ // Add exclusions here
            /node_modules\/react-datepicker/, // Exclude react-datepicker
            /node_modules\/some-other-package/ // Add others if needed
          ],
        },
          // optimization : {
          //   usedExports: true,
          // }
        
      ],
    },
  };