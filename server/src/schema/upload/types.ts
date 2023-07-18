import gql from "graphql-tag";

const uploadTypes = gql`
  type UploadType {
    url: String!
  }
  extend type Mutation {
    uploadFile(file: Upload!): UploadType!
  }
`;
export default uploadTypes;
