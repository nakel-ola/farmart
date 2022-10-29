export type Msg = {
  msg: string;
};
export type ErrorMsg = {
  __typename: string;
  error: string;
};

export type mongodbDefaultType = {
  createdAt: Date;
  updatedAt: Date;
}