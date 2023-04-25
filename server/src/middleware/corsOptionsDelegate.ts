import config from "../config";

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

export default corsOptionsDelegate;
