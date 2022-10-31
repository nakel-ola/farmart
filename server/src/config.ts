const dotenv = require('dotenv');
dotenv.config();


export = {
  port: process.env.PORT || 4000,
  allowport: process.env.ALLOWPORT,
  saltRounds: Number(process.env.SALTROUNDS),
  jwt_key: process.env.JWT_KEY,
  expiresIn: process.env.EXPIRESIN,
  mongodb_uri: process.env.MONGODB_URI,
  admin_url: process.env.ADMIN_URL,
  client_url: process.env.CLIENT_URL,
  session_key: process.env.SESSION_KEY,
  firebase_project_id: process.env.FIREBASE_PROJECT_ID,
  firebase_token: process.env.FIREBASE_TOKEN,
  firebase_private_key: process.env.FIREBASE_PRIVATE_KEY,
  firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL,
  firebase_client_id: process.env.FIREBASE_CLIENT_ID,
  firebase_token_url: process.env.FIREBASE_TOKEN_URL,
};