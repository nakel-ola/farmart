import cors from "cors";
import express from "express";
import path from "path";
import config from "./config";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Configure CORS
app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (config.allowedOrigins.includes(origin!) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    next();
  } else {
    next(new Error(`Access Denied - ${origin}`));
  }
});

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (config.allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Access Denied - ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
export default app;
