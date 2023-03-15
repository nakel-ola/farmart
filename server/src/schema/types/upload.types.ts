import gql from "graphql-tag";

const uploadTypes = gql`
  type UploadType {
    url: String!
  }
  extend type Mutation {
    uploadFile(file: Upload!): UploadType!
    uploadFiles(files: [Upload!]!): [UploadType!]!
    uploadBlob(blob: Upload): UploadType!
  }
`;
export default uploadTypes;
