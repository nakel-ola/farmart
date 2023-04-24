"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 4000,
    session_key: process.env.SESSION_KEY,
    saltRounds: Number(process.env.SALTROUNDS),
    jwt_key: process.env.JWT_KEY,
    expiresIn: process.env.EXPIRESIN,
    mongodb_uri: process.env.MONGODB_URI,
    admin_url: process.env.ADMIN_URL,
    client_url: process.env.CLIENT_URL,
    storage_project_id: process.env.STORAGE_PROJECT_ID,
    storage_bucket_name: process.env.STORAGE_BUCKET_NAME,
    storage_credentials_path: process.env.STORAGE_CREDENTIALS_PATH,
    storage_credentials: process.env.STORAGE_CREDENTIALS,
    stmp_email: process.env.STMP_EMAIL,
    redis_host: process.env.REDIS_HOST,
    redis_port: Number(process.env.REDIS_PORT),
    redis_password: process.env.REDIS_PASSWORD,
    stmp_password: process.env.STMP_PASSWORD,
    email_from: '"Farmart Team" noreply@farmart.com',
    app_name: "Farmart",
    admin_session_name: "auth_admin",
    client_session_name: "auth",
    session_name: "farmart_auth",
    session_prefix: "farmart:",
};
exports.default = config;
//# sourceMappingURL=config.js.map