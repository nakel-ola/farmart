import cors, { CorsOptions, CorsRequest } from "cors";
import config from "../config";

type Callback = (err: Error | null, options?: CorsOptions | undefined) => void;

// var corsOptionsDelegate = function (req: CorsRequest, callback: Callback) {
//   try {
//     var corsOptions: CorsOptions;
//     const allowedOrigins = [config.client_url!, config.admin_url!];
//     const origin = req.headers.origin!;

//     const isAllow = allowedOrigins.includes(origin);

//     if (isAllow) {
//       (req as any).admin = origin === config.admin_url;

//       corsOptions = {
//         origin: origin,
//         // credentials: true,
//       };
//     } else {
//       corsOptions = { origin: false };
//     }
//   } catch (err: any) {
//     throw new Error(err.message);
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

var corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  var whitelist = [config.client_url, config.admin_url];

  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    (req as any).admin = req.header("Origin") === config.admin_url;

    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default cors(corsOptionsDelegate);
