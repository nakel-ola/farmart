import Mutation from "./mutations";
import Query from "./queries";
import typeDefs from "./types";

const resolvers = {
  Query,
  Mutation,
  Upload: require("graphql-upload-minimal").GraphQLUpload,
};
export { resolvers, typeDefs };
