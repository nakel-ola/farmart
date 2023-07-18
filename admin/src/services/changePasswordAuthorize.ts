import request, { gql } from "graphql-request";
import { Awaitable, User } from "next-auth";
import { z } from "zod";
import { ChangePasswordResponse } from "../../typing";
import fetchUser from "./fetchUser";
import { Req } from "./loginAuthorize";

const PasswordMutation = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

type Credentials = Record<never, string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const changePasswordAuthorize: SigninAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      verificationCode: z.string().length(21),
      password: z
        .string({
          required_error: "Password must be provided",
        })
        .min(8, "Password must be at least 8 characters"),
    });

    const saveParse = schema.safeParse(credentials);

    if (!saveParse.success && saveParse.error) {
      const message = saveParse.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(message);
    }

    const res = await request<ChangePasswordResponse>(
      process.env.SERVER_URL!,
      PasswordMutation,
      { input: (saveParse as any).data! },
      { origin: process.env.BASE_URL }
    );

    const user = await fetchUser(res.changePassword.accessToken);

    return {
      ...user,
      accessToken: res.changePassword.accessToken,
      refreshToken: res.changePassword.refreshToken,
    };
  } catch (error: any) {
    console.log(error);
    const errorMsgs = error.response.errors
      .map((err: any) => err.message)
      .join(",");
    throw new Error(errorMsgs);
  }
};

export default changePasswordAuthorize;
