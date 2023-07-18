import { isAuthenticated } from "./user";

const mutations = {
  uploadFile: isAuthenticated,
};

export default { mutations };
