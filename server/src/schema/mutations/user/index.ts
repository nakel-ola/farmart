import blockUser from "./block-user";
import changePassword from "./change-password";
import createEmployeeInvite from "./create-employee-invite";
import deleteEmployeeInvite from "./delete-employee-invite";
import forgetPassword from "./forget-password";
import login from "./login";
import logout from "./logout";
import register from "./register";
import updatePassword from "./update-password";
import updateUser from "./update-user";
import validateCode from "./validate-code";
import deleteEmployee from "./delete-employee";

const user = {
  register,
  login,
  forgetPassword,
  validateCode,
  changePassword,
  updatePassword,
  updateUser,
  blockUser,
  createEmployeeInvite,
  deleteEmployeeInvite,
  deleteEmployee,
  logout,
};

export default user;
