export const config = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/lyan-restaurant",
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_change_me",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || "your_email@gmail.com",
  SMTP_PASS: process.env.SMTP_PASS || "your_email_password",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development"
};
