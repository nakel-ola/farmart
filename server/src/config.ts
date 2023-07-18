const config = {
  port: Number(process.env.PORT) || 4000,
  app_name: "Farmart",
  jwt_secret: process.env.JWT_SECRET,
  expires_in: process.env.EXPIRES_IN,
  refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
  stmp_password: process.env.STMP_PASSWORD,
  stmp_email: process.env.STMP_EMAIL,
  allowedOrigins: JSON.parse(process.env.ALLOWED_ORIGINS!),
  redis_uri: process.env.REDIS_URI!,
  redis_port: Number(process.env.REDIS_PORT!),
  redis_username: process.env.REDIS_USERNAME!,
  redis_password: process.env.REDIS_PASSWORD!,
  redis_host: process.env.REDIS_HOST!,
  storage_project_id: process.env.STORAGE_PROJECT_ID,
  storage_bucket_name: process.env.STORAGE_BUCKET_NAME,
};

export default config;
