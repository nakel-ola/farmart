import { useLazyQuery } from "@apollo/client";
import { ReactNode, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserQuery } from "../pages/_app";
import {
  login,
  selectCookies,
  selectUser,
} from "../redux/features/userSlice";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const cookies = useSelector(selectCookies);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [getDetails] = useLazyQuery(UserQuery);

  const getUser = useCallback(async () => {
    if (!user && cookies) {
      await getDetails({
        fetchPolicy: "network-only",
        onCompleted: async (data) => {
          if (data.user?.__typename !== "ErrorMsg") {
            dispatch(login(data.user));
          }
        },
      });
    }
  }, [cookies, user,getDetails,dispatch]);

  useEffect(() => {
    getUser();
  }, [cookies, user,getUser]);
  return <>{children}</>;
};

export default Wrapper;
