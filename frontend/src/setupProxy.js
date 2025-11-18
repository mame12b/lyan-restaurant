const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Add Permissions-Policy header to all responses
  app.use(function(req, res, next) {
    res.setHeader(
      'Permissions-Policy',
      'bluetooth=(), geolocation=(), microphone=(), camera=(), interest-cohort=(), ' +
      'otp-credentials=(), private-state-token-issuance=(), private-state-token-redemption=(), ' +
      'shared-storage=(), shared-storage-select-url=()'
    );
    next();
  });
  
  // Proxy API requests to backend (if needed)
  // Uncomment if you want to proxy /api requests to backend
  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: 'http://localhost:5000',
  //     changeOrigin: true,
  //   })
  // );
};
