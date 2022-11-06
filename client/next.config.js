/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    SERVER_URL: process.env.SERVER_URL
  },
  reactStrictMode: true,
}
