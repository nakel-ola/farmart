import request, { gql } from "graphql-request";
import { RefreshResponse } from "../../typing";

const RefreshMutation = gql`
  mutation Refresh {
    refresh {
      accessToken
    }
  }
`;

const refreshToken = async (token: string): Promise<string> => {
  try {
    const res = await request<RefreshResponse>(
      process.env.SERVER_URL!,
      RefreshMutation,
      {},
      {
        "x-refresh-token": token,
        origin: process.env.BASE_URL,
      }
    );

    return res.refresh.accessToken;
  } catch (error: any) {
    console.log(error);
    const errorMsgs = error.response.errors
      .map((err: any) => err.message)
      .join(",");
    throw new Error(errorMsgs);
  }
};

export default refreshToken;
