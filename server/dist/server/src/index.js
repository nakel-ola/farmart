"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("./middleware/cors"));
const resolvers_1 = __importDefault(require("./resolvers"));
const type_defs_1 = __importDefault(require("./type-defs"));
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: false }));
app.use(cors_1.default);
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../public")));
const schema = (0, graphql_1.buildSchema)((0, graphql_1.print)(type_defs_1.default));
mongoose_1.default
    .connect(config_1.default.mongodb_uri)
    .then(() => {
    app.use("/graphql", (0, graphql_upload_minimal_1.graphqlUploadExpress)({ maxFileSize: 10000000, maxFiles: 10 }), (0, express_graphql_1.graphqlHTTP)({
        schema,
        rootValue: resolvers_1.default,
        graphiql: true,
    }));
    app.listen(config_1.default.port, () => console.log(`\nServer started at: http://localhost:${config_1.default.port}/graphql\n`));
})
    .catch((err) => console.error(err));
