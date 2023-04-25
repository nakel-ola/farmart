"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../config"));
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
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    var whitelist = [config_1.default.client_url, config_1.default.admin_url];
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        req.admin = req.header("Origin") === config_1.default.admin_url;
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
exports.default = (0, cors_1.default)(corsOptionsDelegate);
//# sourceMappingURL=cors.js.map