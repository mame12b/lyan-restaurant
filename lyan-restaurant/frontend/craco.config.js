module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.forEach((rule) => {
          if (rule.enforce === 'pre' && rule.use?.[0] === 'source-map-loader') {
            rule.exclude = [
              ...(rule.exclude || []),
              /node_modules\/react-datepicker/,
            ];
          }
        });
        return webpackConfig;
      },
    },
  };
  