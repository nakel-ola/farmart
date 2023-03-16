import cors, { CorsRequest,CorsOptions } from "cors";
import config from "../config";

type Callback = (
  err: Error | null,
  options?: CorsOptions | undefined
) => void;

var corsOptionsDelegate = function (req: CorsRequest, callback: Callback) {
  try {
    var corsOptions;
    const allowedOrigins = [config.client_url!, config.admin_url!];
    const origin = req.headers.origin!;
    const isAllow = allowedOrigins.includes(origin);

    console.log(origin)

    if (isAllow) {
      (req as any).admin = origin === config.admin_url;

      corsOptions = {
        origin: allowedOrigins,
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
