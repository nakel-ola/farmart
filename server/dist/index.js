"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.MemoryStore = void 0;
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const express_session_1 = __importDefault(require("express-session"));
const graphql_1 = require("graphql");
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("./middleware/cors"));
const resolvers_1 = __importDefault(require("./resolvers"));
const type_defs_1 = __importDefault(require("./type-defs"));
// import type { ReqBody } from "./typing";
exports.MemoryStore = connect_mongo_1.default.create({
    mongoUrl: config_1.default.mongodb_uri,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "native",
});
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: false }));
app.use(cors_1.default);
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    name: "auth",
    secret: config_1.default.session_key,
    resave: false,
    store: exports.MemoryStore,
    saveUninitialized: false,
    cookie: {
        maxAge: 604800000,
        httpOnly: process.env.NODE_ENV === 'development',
        secure: process.env.NODE_ENV !== 'development'
    },
}));
if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
}
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../public")));
exports.schema = (0, graphql_1.buildSchema)((0, graphql_1.print)(type_defs_1.default));
mongoose_1.default
    .connect(config_1.default.mongodb_uri)
    .then(() => {
    app.use("/graphql", (0, graphql_upload_minimal_1.graphqlUploadExpress)({ maxFileSize: 2 * 1024 * 1024, maxFiles: 1 }), (0, express_graphql_1.graphqlHTTP)({
        schema: exports.schema,
        rootValue: resolvers_1.default,
        graphiql: true,
    }));
    app.listen(config_1.default.port, () => console.log(`\nServer started at: http://localhost:${config_1.default.port}/graphql\n`));
})
    .catch((err) => console.error(err));
