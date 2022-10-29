import { decode, JwtPayload } from "jsonwebtoken";
import { win } from "../redux/features/userSlice";

type Cb = (state: any) => void;

const useAuthChange = (state: any, callback: Cb) => {
  const getUser = () => {
    if (state) {
      const value = decode(state) as JwtPayload;
      if (value?.exp! * 1000 < new Date().getTime()) callback(null);
      else callback({ token: state, ...value });
    } else callback(null);
  };
  getUser();
  win.addEventListener("storage", getUser);

  return () => win.removeEventListener("storage", getUser);
};
export default useAuthChange;
