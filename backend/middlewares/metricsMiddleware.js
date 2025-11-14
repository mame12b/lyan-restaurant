import logger from '../utils/logger.js';

// Simple timing middleware: records time and sets X-Response-Time header
// Logs a warning if the response time exceeds the slowThreshold (ms)
const slowThreshold = 500; // ms

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  let responseTimeMs = null;

  const originalEnd = res.end;

  res.end = function endProxy(chunk, encoding, callback) {
    try {
      const diff = Number(process.hrtime.bigint() - start) / 1e6; // ms
      responseTimeMs = Math.round(diff);
      if (!res.headersSent) {
        res.setHeader('X-Response-Time', `${responseTimeMs}ms`);
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to calculate response time');
    }

    return originalEnd.call(this, chunk, encoding, callback);
  };

  res.once('finish', () => {
    const timeMs = responseTimeMs ?? Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    const logPayload = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      timeMs
    };

    if (timeMs > slowThreshold) {
      logger.warn(logPayload, 'Slow response detected');
    } else {
      logger.debug(logPayload, 'Request served');
    }
  });

  next();
};

export default metricsMiddleware;
