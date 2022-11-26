"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const Date = new graphql_1.GraphQLScalarType({
    name: "Date",
    description: "The `Date` scalar type represents Date, Timestamp, or DateTime",
    serialize(value) {
        return value.getTime();
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
});
exports.default = {
    Date,
    Upload: require("graphql-upload-minimal").GraphQLUpload
};
