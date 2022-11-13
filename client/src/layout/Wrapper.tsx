import { gql, useQuery } from "@apollo/client";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { add } from "../redux/features/categorySlice";
import { login } from "../redux/features/userSlice";

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

  useQuery(UserQuery, {
    onCompleted: (data) => {
      if (data.user?.__typename !== "ErrorMsg") {
        dispatch(login(data.user));
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
