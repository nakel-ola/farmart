import { decode, JwtPayload } from "jsonwebtoken";
import { key, win } from "../redux/features/userSlice";


type Cb = (state: any) => void;

function onAuthChange(cb: Cb) {
  const getUser = () => {
    if (win.localStorage) {
      let result = win.localStorage.getItem(key) as any;
      if (result) {
        let parse = JSON.parse(result);
        const value = decode(parse.token) as JwtPayload;
        if (value?.exp! * 1000 < new Date().getTime()) cb(null);
        else cb({ token: parse.token, ...value });
      } else cb(null);
    }
  };
  getUser();
  win.addEventListener("storage", getUser);
  return () => win.removeEventListener("storage", getUser)
}
export default onAuthChange;
