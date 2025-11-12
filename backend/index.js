// import dotenv from 'dotenv';
// import app from './app.js';
// import connectDB, { config } from './config/db.js';
// import logger from './utils/logger.js';

// dotenv.config();

// const PORT = process.env.PORT || config.PORT || 5001;

// const startServer = async () => {
//     try {
//             await connectDB();
//             app.locals.dbReady = true;
//         app.listen(PORT, () => {
//             logger.info({ port: PORT }, 'Server running');
//         });
//         } catch (error) {
//             app.locals.dbReady = false;
//             logger.error({ err: error }, 'Failed to start server');
//             process.exit(1);
//         }
// };

// startServer();

import dotenv from 'dotenv';
import app from './app.js';
import connectDB, { config } from './config/db.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = Number(process.env.PORT || config.PORT || 5001);

let server;

/**
 * Gracefully shut down the server.
 * Attempts to close the HTTP server and then exit the process.
 */
async function gracefulShutdown(signal) {
  try {
    logger.info({ signal }, 'Shutdown requested');

    if (server) {
      // stop accepting new connections
      server.close((err) => {
        if (err) {
          logger.error({ err }, 'Error closing server');
          process.exit(1);
        }
        logger.info('HTTP server closed');
        // try to close DB connection if mongoose is used
        try {
          // dynamically import mongoose so we don't create a hard dependency in this file
          // (only attempt to close if it's connected)
          // eslint-disable-next-line no-underscore-dangle
          // Note: if you prefer, import mongoose at top and call mongoose.disconnect()
          // here instead of dynamic import.
          import('mongoose').then(async (mongoose) => {
            if (mongoose?.connection?.readyState) {
              await mongoose.disconnect();
              logger.info('MongoDB connection closed');
            }
            process.exit(0);
          }).catch((err) => {
            logger.warn({ err }, 'Could not import mongoose to close connection');
            process.exit(0);
          });
        } catch (err) {
          logger.warn({ err }, 'Failed to disconnect DB during shutdown');
          process.exit(0);
        }
      });
    } else {
      process.exit(0);
    }
  } catch (err) {
    logger.error({ err }, 'Error during graceful shutdown');
    process.exit(1);
  }
}

/**
 * Start the server: connect to DB, set app state, listen on port.
 */
const startServer = async () => {
  try {
    await connectDB();
    app.locals.dbReady = true;

    server = app.listen(PORT, () => {
      logger.info({ port: PORT, env: config.NODE_ENV || process.env.NODE_ENV }, 'Server running');
    });

    // Handle signals for graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Unhandled promise rejections — log and shutdown
    process.on('unhandledRejection', (reason) => {
      logger.error({ reason }, 'Unhandled Rejection encountered, shutting down');
      gracefulShutdown('unhandledRejection');
    });

    // Uncaught exceptions — log and shutdown
    process.on('uncaughtException', (err) => {
      logger.error({ err }, 'Uncaught Exception encountered, shutting down');
      gracefulShutdown('uncaughtException');
    });
  } catch (error) {
    app.locals.dbReady = false;
    logger.error({ err: error }, 'Failed to start server');
    // In production we want to exit so the process manager / host restarts the service.
    process.exit(1);
  }
};

startServer();