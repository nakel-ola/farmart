"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = exports.resolvers = void 0;
const mutations_1 = __importDefault(require("./mutations"));
const queries_1 = __importDefault(require("./queries"));
const types_1 = __importDefault(require("./types"));
exports.typeDefs = types_1.default;
const resolvers = {
    Query: queries_1.default,
    Mutation: mutations_1.default,
    Upload: require("graphql-upload-minimal").GraphQLUpload,
};
exports.resolvers = resolvers;
//# sourceMappingURL=index.js.map