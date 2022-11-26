import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { LogoutMutation } from "../components/Sidebar";
import { add } from "../redux/features/categorySlice";
import { login, logout } from "../redux/features/userSlice";

export const UserQuery = gql`
  query User {
    user {
      ... on User {
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

      ... on ErrorMsg {
        error
      }
    }
  }
`;

export const CategoriesQuery = gql`
  query Categories {
    categories {
      name
    }
  }
`;

const Wrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logOut] = useMutation(LogoutMutation);
  const client = useApolloClient();

  const handleLogout = async () => {
    await logOut({
      onCompleted: () => {
        client.resetStore().then(() => {
          dispatch(logout());
          router.push("/");
        });
      },
      onError: (er) => console.table(er),
    });
  };

  useQuery(UserQuery, {
    onCompleted: async (data) => {
      if (data.user?.__typename !== "ErrorMsg") {
        if (!data.user.blocked) {
          dispatch(login(data.user));
        } else {
          await handleLogout()
        }
      }
    },
    onError: (err) => {
      console.table(err);
    },
  });

  useQuery(CategoriesQuery, {
    onCompleted: (data) => {
      if (data.user?.__typename !== "ErrorMsg") {
        dispatch(add([{ name: "All" }, ...data.categories]));
      }
    },
  });
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-dark">
      {children}
    </div>
  );
};

export default Wrapper;
