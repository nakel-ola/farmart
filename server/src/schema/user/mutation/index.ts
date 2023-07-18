import blockUser from "./block_user";
import changePassword from "./change_password";
import createEmployeeInvite from "./create_employee_invite";
import deleteEmployee from "./delete_employee";
import deleteEmployeeInvite from "./delete_employee_invite";
import forgetPassword from "./forget_password";
import login from "./login";
import logout from "./logout";
import refresh from "./refresh";
import register from "./register";
import updatePassword from "./update_password";
import updateUser from "./update_user";
import validateCode from "./validate_code";

const mutations = {
  login,
  register,
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
  refresh
};

export default mutations;