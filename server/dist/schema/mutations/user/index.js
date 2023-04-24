"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_user_1 = __importDefault(require("./block-user"));
const change_password_1 = __importDefault(require("./change-password"));
const create_employee_invite_1 = __importDefault(require("./create-employee-invite"));
const delete_employee_invite_1 = __importDefault(require("./delete-employee-invite"));
const forget_password_1 = __importDefault(require("./forget-password"));
const login_1 = __importDefault(require("./login"));
const logout_1 = __importDefault(require("./logout"));
const register_1 = __importDefault(require("./register"));
const update_password_1 = __importDefault(require("./update-password"));
const update_user_1 = __importDefault(require("./update-user"));
const validate_code_1 = __importDefault(require("./validate-code"));
const delete_employee_1 = __importDefault(require("./delete-employee"));
const user = {
    register: register_1.default,
    login: login_1.default,
    forgetPassword: forget_password_1.default,
    validateCode: validate_code_1.default,
    changePassword: change_password_1.default,
    updatePassword: update_password_1.default,
    updateUser: update_user_1.default,
    blockUser: block_user_1.default,
    createEmployeeInvite: create_employee_invite_1.default,
    deleteEmployeeInvite: delete_employee_invite_1.default,
    deleteEmployee: delete_employee_1.default,
    logout: logout_1.default,
};
exports.default = user;
//# sourceMappingURL=index.js.map