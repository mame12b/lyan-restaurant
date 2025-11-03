
import jwt from 'jsonwebtoken';

const {
  JWT_SECRET = 'default_unsafe_secret_change_me',
  JWT_EXPIRES_IN = '15m',
  REFRESH_TOKEN_SECRET = 'default_unsafe_refresh_secret_change_me',
  REFRESH_TOKEN_EXPIRES_IN = '7d'
} = process.env;


export const generateToken = (user, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn });
};



export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

