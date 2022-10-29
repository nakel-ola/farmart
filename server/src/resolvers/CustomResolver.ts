
import { GraphQLScalarType, Kind } from "graphql";

const Date = new GraphQLScalarType({
  name: "Date",
  description: "The `Date` scalar type represents Date, Timestamp, or DateTime",
  serialize(value) {
    return value.getTime();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});



export default {
  Date,
  Upload: require("graphql-upload-minimal").GraphQLUpload
};
