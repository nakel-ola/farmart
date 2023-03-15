import { gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";

export const UserQuery = gql`
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
      level
      createdAt
      updatedAt
    }
  }
`;

const useUser = (fetchPolicy: boolean = false) => {
  const dispatch = useDispatch();
  const [getUser, others] = useLazyQuery(UserQuery, {
    fetchPolicy: fetchPolicy ? "network-only" : "cache-first",
    onCompleted: (data) => dispatch(login(data.user)),
    onError: (err) => console.table(err),
    errorPolicy: "ignore",
  });

  return { getUser, ...others };
};
export default useUser;
