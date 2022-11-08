import cors from "cors";
import config from "../config";

var corsOptionsDelegate = function (req, callback) {
  try {
    var corsOptions;
    const allowports = config.allowport.split(",");

    if (allowports.find((port) => port === req.header("Origin"))) {
      req.admin = req.headers.origin === config.admin_url ? true : req.headers.origin === config.client_url ? false : null;

      corsOptions = {
        origin: allowports,
        credentials: true,
        methods: "GET, POST",
        optionsSuccessStatus: 200,
      };
    } else {
      corsOptions = { origin: false };
      // throw new Error("Can't access server");
    }
  } catch (err) {
    // console.log(err)
    throw new Error(err.message);
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default cors(corsOptionsDelegate);
