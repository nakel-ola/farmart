"use strict";
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT || 4000,
    allowport: process.env.ALLOWPORT,
    saltRounds: Number(process.env.SALTROUNDS),
    jwt_key: process.env.JWT_KEY,
    expiresIn: process.env.EXPIRESIN,
    mongodb_uri: process.env.MONGODB_URI,
    admin_url: process.env.ADMIN_URL,
    client_url: process.env.CLIENT_URL
};
