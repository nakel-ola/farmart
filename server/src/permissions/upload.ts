import { isAuthenticated } from "./user";

const uploadMutation = {
  uploadFile: isAuthenticated,
};

export { uploadMutation };
