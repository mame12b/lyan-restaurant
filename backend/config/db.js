// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// // Database connection configuration
// const connectDB = async () => {
//     try {
//         const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/lyan-restaurant";
//         console.log("Attempting to connect to MongoDB...");
//         console.log("URI:", uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs
//         await mongoose.connect(uri);
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.error("MongoDB connection failed:", error.message);
//         console.error("Full error:", error);
//         process.exit(1);
//     }
// };

// // Environment variables
// const config = {
//     PORT: process.env.PORT || 5001,
//     MONGODB_URI: process.env.MONGODB_URI,
//     JWT_SECRET: process.env.JWT_SECRET,
//     JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
//     REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
//     REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
//     SMTP_HOST: process.env.SMTP_HOST,
//     SMTP_PORT: process.env.SMTP_PORT || 465,
//     SMTP_USER: process.env.SMTP_USER,
//     SMTP_PASS: process.env.SMTP_PASS,
//     FRONTEND_URL: process.env.FRONTEND_URL,
//     NODE_ENV: process.env.NODE_ENV || 'development'
// };

// export { config };
// export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Build a MongoDB connection URI safely from environment variables.
 * Priority:
 *  1) process.env.MONGODB_URI (complete URI supplied directly)
 *  2) construct from MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB
 * If no credentials are provided, returns null.
 */
function buildMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const user = process.env.MONGO_USER;
  const pass = process.env.MONGO_PASS;
  const host = process.env.MONGO_HOST || "lyan-restaurant.csmycpp.mongodb.net";
  const db = process.env.MONGO_DB || "lyan";

  if (user && pass) {
    // Always URL-encode credentials to avoid issues with special characters
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}/${db}?retryWrites=true&w=majority`;
  }

  return null;
}

/** Mask credentials in a Mongo URI for safe logging */
function maskUri(uri) {
  if (!uri) return "";
  // Replace the user:pass@ part with ****:****@
  return uri.replace(/(mongodb(?:\+srv)?:\/\/)(.*@)/, "$1****:****@");
}

// Database connection function
const connectDB = async (retries = 5) => {
  const uri = buildMongoUri();

  if (!uri) {
    console.error(
      "MongoDB connection URI not found. Set MONGODB_URI or MONGO_USER and MONGO_PASS environment variables."
    );
    // In development we don't necessarily want to exit the process, but in production it's reasonable
    if (process.env.NODE_ENV === "production") process.exit(1);
    return;
  }

  while (retries > 0) {
    try {
      console.log("Attempting to connect to MongoDB...");
      console.log("URI:", maskUri(uri));
      // Recommended options for modern mongoose drivers
      await mongoose.connect(uri, {
        // keep defaults as mongoose recommends; explicit options can be included if needed
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // serverSelectionTimeoutMS: 10000
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(`MongoDB connection failed. Retries left: ${retries - 1}`, error.message || error);
      retries -= 1;
      if (retries === 0) {
        console.error("Full error:", error);
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Centralized config values (read from env)
const config = {
  PORT: process.env.PORT || 5001,
  // Expose the final Mongo URI the app will try to use (may be null)
  MONGODB_URI: buildMongoUri() || null,
  JWT_SECRET: process.env.JWT_SECRET || null,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || null,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  SMTP_HOST: process.env.SMTP_HOST || null,
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
  SMTP_USER: process.env.SMTP_USER || null,
  SMTP_PASS: process.env.SMTP_PASS || null,
  FRONTEND_URL: process.env.FRONTEND_URL || null,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export { config };
export default connectDB;