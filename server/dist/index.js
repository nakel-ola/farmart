"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_1 = require("@graphql-tools/schema");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const graphql_middleware_1 = require("graphql-middleware");
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const context_1 = __importStar(require("./context"));
// import cors from "./middleware/cors";
// import originMiddleware from "./middleware/originMiddleware";
const cors_1 = __importDefault(require("cors"));
const permissions_1 = __importDefault(require("./permissions"));
const schema_2 = require("./schema");
/** @ts-ignore */
const redisStore = new connect_redis_1.default({
    /** @ts-ignore */
    client: context_1.redis,
    prefix: config_1.default.session_prefix,
    ttl: 60 * 60 * 24 * 7,
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        var whitelist = [config_1.default.client_url, config_1.default.admin_url];
        var corsOptions = {
            origin: function (origin, callback) {
                const index = whitelist.indexOf(origin !== null && origin !== void 0 ? origin : "");
                if (index)
                    callback(null, "https://farmart.vercel.app, https://farmart-admin.vercel.app");
                else
                    callback(new Error("Not allowed by CORS"));
            },
            credentials: true,
        };
        app.use(express_1.default.json({ limit: "50mb" }));
        app.use(express_1.default.urlencoded({ limit: "50mb", extended: false }));
        app.use((0, cors_1.default)(corsOptions));
        app.use(express_1.default.static(path_1.default.resolve(__dirname, "../public")));
        app.use((0, cookie_parser_1.default)());
        // app.use(originMiddleware);
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        let production = false;
        if (app.get("env") === "production") {
            app.set("trust proxy", 1); // trust first proxy
            production = true;
        }
        const sessionMiddleware = (0, express_session_1.default)({
            name: config_1.default.session_name,
            secret: config_1.default.session_key,
            resave: false,
            store: redisStore,
            saveUninitialized: false,
            cookie: {
                maxAge: 60 * 60 * 24 * 7 * 1000,
                sameSite: production ? "none" : false,
                httpOnly: true,
                secure: production,
            },
        });
        app.use(sessionMiddleware);
        const httpServer = http_1.default.createServer(app);
        const schema = (0, schema_1.makeExecutableSchema)({
            typeDefs: schema_2.typeDefs,
            resolvers: schema_2.resolvers,
        });
        const middlewareSchema = (0, graphql_middleware_1.applyMiddleware)(schema, permissions_1.default);
        const plugins = [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })];
        const server = new server_1.ApolloServer({
            schema: middlewareSchema,
            plugins,
            csrfPrevention: true,
            cache: "bounded",
        });
        yield server.start();
        yield mongoose_1.default
            .connect(config_1.default.mongodb_uri)
            .then(() => console.log("Database connected successfully"))
            .catch((e) => {
            throw new Error("Something went wrong when connecting to Database");
        });
        app.use("/graphql", (0, graphql_upload_minimal_1.graphqlUploadExpress)({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }), (0, express4_1.expressMiddleware)(server, { context: context_1.default }));
        yield new Promise((resolve) => httpServer.listen({ port: config_1.default.port }, resolve)).then(() => console.log(`🚀 Server ready at http://localhost:${config_1.default.port}/graphql`));
    });
}
bootstrap();
//# sourceMappingURL=index.js.map