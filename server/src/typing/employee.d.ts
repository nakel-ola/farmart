export type CreateEmployeeInviteArgs = {
    input: {
      email: string;
      level: string;
    };
  };
  
  export type LoginArgs = {
    input: {
      email: string;
      password: string;
    };
  };
  
  export type ForgetPasswordArgs = {
    input: {
      name: string;
      email: string;
    };
  };
  
  export type ChangePasswordArgs = {
    input: {
      name: string;
      email: string;
      password: string;
      validationToken: string;
    };
  };
  export type ValidateCodeArgs = {
    input: {
      name: string;
      email: string;
      validationToken: string;
    };
  };
  export type UpdatePasswordArgs = {
    input: {
      email: string;
      oldPassword: string;
      newPassword: string;
    };
  };
  export type ModifyUserArgs = {
    input: {
      employeeId: string;
      email: string;
      gender: string;
      name: string;
      phoneNumber: string;
      level: string;
      birthday: Date;
    };
  };
  
  export type EmployeesArgs = {
    input: {
      page: number;
      limit: number;
    };
  };
  
  export type EmployeeTypes = {
    __typename?: string;
    id: string;
    email: string;
    name: string;
    gender: string;
    birthday?: Date;
    phoneNumber: string;
    photoUrl?: string;
    level: "Gold" | "Silver" | "Bronze";
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type EmployeesDataType = {
    __typename: string;
    page: number;
    totalItems: number;
    results: EmployeeTypes[];
  };
  
  export type TokenType = {
    token: string;
  };
  
  export type ValidationTokenType = {
    validationToken: string;
  };
  
