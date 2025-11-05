import dotenv from 'dotenv';
import app from './app.js';
import connectDB, { config } from './config/db.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || config.PORT || 5001;

const startServer = async () => {
    try {
            await connectDB();
            app.locals.dbReady = true;
        app.listen(PORT, () => {
            logger.info({ port: PORT }, 'Server running');
        });
        } catch (error) {
            app.locals.dbReady = false;
            logger.error({ err: error }, 'Failed to start server');
            process.exit(1);
        }
};

startServer();