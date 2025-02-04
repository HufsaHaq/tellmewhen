import jwt from 'jsonwebtoken';
import { storeAccessToken } from './dbhelper.js';
import { deleteExpiredTokens } from './dbhelper.js';

const generateAccessToken = (userId) => {
  const token = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });
  const expirationTime = new Date(Date.now() + 3600 * 1000); // 1 hour from now
  storeAccessToken(userId, token, expirationTime);
  return token;
};

setInterval(async () => {
  await deleteExpiredTokens();
  console.log('Expired tokens cleaned up.');
}, 3600 * 1000); // Run every hour
