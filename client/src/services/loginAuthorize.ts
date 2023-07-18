// import request, { gql } from "graphql-request";
import request, { gql } from "graphql-request";
import type { Awaitable, RequestInternal, User } from "next-auth";
import { z } from "zod";
import { LoginResponse } from "../../typing";
import fetchUser from "./fetchUser";

export type Req = Pick<
  RequestInternal,
  "body" | "query" | "headers" | "method"
>;
type Credentials = Record<never, string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const LoginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const loginAuthorize: SigninAuthorize = async (credentials, req) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
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

    const res = await request<LoginResponse>(
      process.env.SERVER_URL!,
      LoginMutation,
      { input: (saveParse as any).data!,},
      { origin: process.env.BASE_URL,}
    );

    const user = await fetchUser(res.login.accessToken);

    return {
      ...user,
      accessToken: res.login.accessToken,
      refreshToken: res.login.refreshToken,
    };
  } catch (error: any) {
    console.log(error);
    const errorMsgs = error.response.errors
      .map((err: any) => err.message)
      .join(",");
    throw new Error(errorMsgs);
  }
};

export default loginAuthorize;
