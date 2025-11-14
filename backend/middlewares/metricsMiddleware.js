import logger from '../utils/logger.js';

// Simple timing middleware: records time and sets X-Response-Time header
// Logs a warning if the response time exceeds the slowThreshold (ms)
const slowThreshold = 500; // ms

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.once('finish', () => {
    try {
      const diff = Number(process.hrtime.bigint() - start) / 1e6; // ms
      const rounded = Math.round(diff);
      res.setHeader('X-Response-Time', `${rounded}ms`);
      if (rounded > slowThreshold) {
        logger.warn({ method: req.method, url: req.originalUrl, status: res.statusCode, timeMs: rounded }, 'Slow response detected');
      } else {
        logger.debug({ method: req.method, url: req.originalUrl, status: res.statusCode, timeMs: rounded }, 'Request served');
      }
    } catch (err) {
      // avoid throwing during shutdown
      logger.warn({ err }, 'Failed to record response time');
    }
  });

  next();
};

export default metricsMiddleware;
