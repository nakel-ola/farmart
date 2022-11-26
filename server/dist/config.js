"use strict";
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    port: process.env.PORT || 4000,
    saltRounds: Number(process.env.SALTROUNDS),
    jwt_key: process.env.JWT_KEY,
    expiresIn: process.env.EXPIRESIN,
    mongodb_uri: process.env.MONGODB_URI,
    admin_url: process.env.ADMIN_URL,
    client_url: process.env.CLIENT_URL,
    session_key: process.env.SESSION_KEY,
    storage_project_id: process.env.STORAGE_PROJECT_ID,
    storage_bucket_name: process.env.STORAGE_BUCKET_NAME,
    storage_credentials_path: process.env.STORAGE_CREDENTIALS_PATH,
    stmp_email: process.env.STMP_EMAIL,
    stmp_password: process.env.STMP_PASSWORD,
    email_from: '"Farmart Team" noreply@farmart.com',
    app_name: "Farmart",
    admin_session_name: "auth_admin",
    client_session_name: "auth",
};
