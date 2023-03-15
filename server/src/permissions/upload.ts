import { isAuthenticated } from "./user";

const uploadMutation = {
  uploadFile: isAuthenticated,
  uploadFiles: isAuthenticated,
  uploadBlob: isAuthenticated,
};

export { uploadMutation };
