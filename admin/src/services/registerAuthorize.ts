import request, { gql } from "graphql-request";
import { Awaitable, User } from "next-auth";
import { z } from "zod";
import { RegisterResponse } from "../../typing";
import fetchUser from "./fetchUser";
import { Req } from "./loginAuthorize";

const RegisterMutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

type Credentials = Record<never, string> | undefined;
type SignUpAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const registerAuthorize: SignUpAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      name: z.string({
        required_error: "Name must be provided",
      }),
      phoneNumber: z.string({
        required_error: "Phone number must be provided",
      }),
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

    const res = await request<RegisterResponse>(
      process.env.SERVER_URL!,
      RegisterMutation,
      { input: { ...(saveParse as any).data! } },
      { origin: process.env.BASE_URL }
    );

    const user = await fetchUser(res.register.accessToken);

    return {
      ...user,
      accessToken: res.register.accessToken,
      refreshToken: res.register.refreshToken,
    };
  } catch (error: any) {
    console.log(error);
    const errorMsgs = error.response.errors
      .map((err: any) => err.message)
      .join(",");
    throw new Error(errorMsgs);
  }
};
export default registerAuthorize;
