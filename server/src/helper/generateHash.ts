import { genSaltSync, hashSync } from "bcryptjs";
import config from "../config";
const generateHash = (password: string) => {
  const salt = genSaltSync(config.saltRounds);

  const hash = hashSync(password, salt);

  return hash;
};

export default generateHash