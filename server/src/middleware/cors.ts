import cors, { CorsRequest } from "cors";
import config from "../config";

type Callback = (
  err: Error | null,
  options?: cors.CorsOptions | undefined
) => void;

var corsOptionsDelegate = function (req: CorsRequest, callback: Callback) {
  try {
    var corsOptions;
    const allowports = [config.client_url, config.admin_url];
    const isAllow = allowports.find((port) => port === req.headers.origin);

    if (isAllow) {
      (req as any).admin = req.headers.origin === config.admin_url;

      corsOptions = {
        origin: req.headers.origin,
        credentials: true,
        methods: "GET, POST",
        optionsSuccessStatus: 200,
      };
    } else {
      corsOptions = { origin: false };
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default cors(corsOptionsDelegate);
