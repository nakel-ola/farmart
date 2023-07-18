import { gql } from "@apollo/client";
import request from "graphql-request";
import { z } from "zod";
import { UserResponse, UserType } from "../../typing";

const UserQuery = gql`
  query User($uid: ID) {
    user(uid: $uid) {
      id
      email
      name
      photoUrl
      blocked
      gender
      birthday
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

const fetchUser = async (token: string): Promise<UserType> => {
  try {
    const res = await request<UserResponse>(
      process.env.SERVER_URL!,
      UserQuery,
      {},
      {
        "x-access-token": token,
        origin: process.env.BASE_URL,
      }
    );

    const schema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      photoUrl: z.string().nullable(),
      phoneNumber: z.string().nullable(),
      gender: z.string().nullable(),
      birthday: z.date().nullable(),
      blocked: z.boolean().nullable(),
      updatedAt: z.string(),
      createdAt: z.string(),
    });

    const saveParse = schema.safeParse(res.user);

    if (!saveParse.success) throw new Error("Something went wrong");

    return saveParse.data as any;
  } catch (error: any) {
    console.log(error);
    const errorMsgs = error.response.errors
      .map((err: any) => err.message)
      .join(",");
    throw new Error(errorMsgs);
  }
};

export default fetchUser;
