/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    TOKEN: process.env.TOKEN,
    TOKEN_URL: process.env.TOKEN_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CLIENT_EMAIL: process.env.CLIENT_EMAIL,
    CLIENT_ID: process.env.CLIENT_ID,
  },
  reactStrictMode: true,
};
