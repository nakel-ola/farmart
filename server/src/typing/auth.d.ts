import type { mongodbDefaultType } from "./custom";

export type RegisterArgs = {
  input: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  };
};

export type AddressType = {
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  default?: boolean;
  info?: string;
  phoneNumber2?: string;
};

export interface UserType extends mongodbDefaultType {
  id: string;
  email: string;
  phoneNumber: string;
  name: string;
  gender?: string;
  birthday?: string;
  photoUrl?: string;
  addresses?: AddressType[];
  blocked: boolean;
}

export type ModifyUserArgs = {
  input: {
    email: string;
    name: string;
    gender: string;
    birthday: string;
    phoneNumber: string;
  };
};

export type UsersArgs = {
  input: {
    admin: boolean;
    page: number;
    limit: number;
  };
};

export type UserDataType = {
  __typename: string;
  page: number;
  totalItems: number;
  results: UserType[];
};

export type BlockUserArgs = {
  input: {
    customerId: string;
    email: string;
    blocked: boolean;
  };
};
